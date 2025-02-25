import { db } from "@/db/drizzle";
import { citySets, photos } from "@/db/schema/photos";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { sql } from "drizzle-orm";

export const summaryRouter = createTRPCRouter({
  getSummary: protectedProcedure.query(async () => {
    const photosData = await db.select().from(photos);
    const citySetsData = await db.select().from(citySets);

    // 获取年度统计数据
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4;

    const yearlyStats = await db.select({
      year: sql<number>`EXTRACT(YEAR FROM ${photos.dateTimeOriginal})::integer`,
      count: sql<number>`COUNT(*)::integer`,
    })
    .from(photos)
    .where(sql`${photos.dateTimeOriginal} IS NOT NULL AND EXTRACT(YEAR FROM ${photos.dateTimeOriginal}) >= ${startYear}`)
    .groupBy(sql`EXTRACT(YEAR FROM ${photos.dateTimeOriginal})`)
    .orderBy(sql`EXTRACT(YEAR FROM ${photos.dateTimeOriginal}) DESC`);

    // 创建年度统计对象
    const yearCounts: Record<number, number> = {};
    for (let year = currentYear; year >= startYear; year--) {
      yearCounts[year] = 0;
    }

    // 填充实际数据
    yearlyStats.forEach(({ year, count }) => {
      if (year >= startYear && year <= currentYear) {
        yearCounts[year] = count;
      }
    });

    return {
      data: {
        photoCount: photosData.length,
        cityCount: citySetsData.length,
        yearlyStats: yearCounts,
      },
    };
  }),
});
