import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { posts } from "@/db/schema/posts";
import { db } from "@/db/drizzle";
import { z } from "zod";
import { and, eq, lt, or, desc } from "drizzle-orm";

export const blogRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit } = input;

      const data = await db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.visibility, "public"),
            cursor
              ? or(
                  lt(posts.updatedAt, cursor.updatedAt),
                  and(
                    eq(posts.updatedAt, cursor.updatedAt),
                    lt(posts.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .limit(limit + 1)
        .orderBy(desc(posts.updatedAt));

      const hasMore = data.length > limit;
      // Remove the last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // Set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return { items, nextCursor };
    }),

  getLatest: baseProcedure.query(async () => {
    const [data] = await db
      .select()
      .from(posts)
      .where(eq(posts.visibility, "public"))
      .orderBy(desc(posts.updatedAt))
      .limit(1);

    return data;
  }),
});
