import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { db } from "@/db/drizzle";
import { desc } from "drizzle-orm";
import { citySets } from "@/db/schema/photos";

export const travelRouter = createTRPCRouter({
  getLatestTravel: baseProcedure.query(async () => {
    const [latestTravel] = await db.query.citySets.findMany({
      with: {
        photos: true,
        coverPhoto: true,
      },
      orderBy: desc(citySets.createdAt),
      limit: 1,
    });

    return latestTravel;
  }),
});
