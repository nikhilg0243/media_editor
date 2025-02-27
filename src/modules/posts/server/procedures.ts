import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { posts, postsInsertSchema } from "@/db/schema/posts";
import { db } from "@/db/drizzle";
import { z } from "zod";
import { and, eq, lt, or, desc } from "drizzle-orm";

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(postsInsertSchema)
    .mutation(async ({ input }) => {
      const values = input;

      const [newPost] = await db.insert(posts).values(values).returning();

      return newPost;
    }),
  getMany: protectedProcedure
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
});
