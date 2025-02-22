import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { desc, eq, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  photosInsertSchema,
  photos,
  citySets,
  photosUpdateSchema,
} from "@/db/schema/photos";
import { auth } from "@/modules/auth/lib/auth";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  /**
   * GET /photos
   * Get all photos from the database
   * @returns {Array.<Object>} An array of photos
   */
  .get("/", async (c) => {
    const data = await db
      .select()
      .from(photos)
      .orderBy(desc(photos.dateTimeOriginal));

    return c.json({ data });
  })
  /**
   * POST /photos
   * Create a new photo to the database
   * @param {Object} values - The values to insert into the database
   * @returns {Object} The inserted photo
   */
  // src/app/api/[[...route]]/photos.ts
  .post("/", zValidator("json", photosInsertSchema), async (c) => {
    const values = c.req.valid("json");
    const user = c.get("user");

    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    try {
      const [insertedPhoto] = await db
        .insert(photos)
        .values(values)
        .returning();

      const cityName =
        values.countryCode === "JP" || values.countryCode === "TW"
          ? values.region
          : values.city;

      // 2. 如果有地理信息，更新城市集合
      if (insertedPhoto.country && cityName) {
        await db
          .insert(citySets)
          .values({
            country: insertedPhoto.country,
            countryCode: insertedPhoto.countryCode,
            city: cityName,
            photoCount: 1,
            coverPhotoId: insertedPhoto.id,
          })
          .onConflictDoUpdate({
            target: [citySets.country, citySets.city],
            set: {
              countryCode: insertedPhoto.countryCode,
              photoCount: sql`${citySets.photoCount} + 1`,
              coverPhotoId: sql`COALESCE(${citySets.coverPhotoId}, ${insertedPhoto.id})`,
              updatedAt: new Date(),
            },
          });

        const updatedCitySet = await db
          .select()
          .from(citySets)
          .where(
            sql`${citySets.country} = ${insertedPhoto.country} AND ${citySets.city} = ${insertedPhoto.city}`
          );

        console.log("Updated city set:", updatedCitySet);
      } else {
        console.log(
          "No geo information available for photo:",
          insertedPhoto.id
        );
      }

      return c.json({
        success: true,
        data: insertedPhoto,
      });
    } catch (error) {
      console.error("Photo upload error:", error);
      return c.json(
        {
          success: false,
          error: "Failed to create photo",
          details: error,
        },
        500
      );
    }
  })
  /**
   * GET /photos/:id
   * Get a single photo from the database
   * @param {string} id - The ID of the photo to retrieve
   * @returns {Object} The photo object
   */
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");
    const data = await db.select().from(photos).where(eq(photos.id, id));

    if (data.length === 0) {
      return c.json({ success: false, error: "Photo not found" }, 404);
    }

    return c.json({ data: data[0] });
  })
  /**
   * PATCH /photos/:id
   * Update a photo in the database
   * @param {string} id - The ID of the photo to update
   * @param {Object} values - The values to update the photo with
   * @returns {Object} The updated photo object
   */
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", photosUpdateSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");
      const user = c.get("user");

      if (!user) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
      }

      const data = await db
        .update(photos)
        .set(values)
        .where(eq(photos.id, id))
        .returning();

      if (data.length === 0) {
        return c.json({ success: false, error: "Photo not found" }, 404);
      }

      return c.json({ success: true, data: data[0] });
    }
  );

export default app;
