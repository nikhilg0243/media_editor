"use client";

// External dependencies
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// UI Components
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/trpc/client";

export const LatestPostSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <LatestPostSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const LatestPostSectionSuspense = () => {
  const [data] = trpc.posts.getMany.useSuspenseQuery({
    limit: 1,
  });

  return (
    <Link
      href={`/blog/${data.items[0].slug}`}
      className="block w-full h-full relative rounded-xl overflow-hidden group cursor-pointer"
    >
      <Image
        src={data.items[0].coverImage || "/placeholder.svg"}
        alt="Image"
        fill
        unoptimized
        priority
        className="object-cover group-hover:blur-sm transition-[filter] duration-300 ease-out"
      />

      <div className="absolute w-full bottom-0 p-3">
        <div className="bg-background backdrop-blur-sm p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge>
              <span className="text-xs font-light">New</span>
            </Badge>
            <h2 className="font-light">{data.items[0].title}</h2>
          </div>

          <div className="relative mr-2">
            <span className="text-sm font-light">Read</span>
            <div className="absolute bottom-[2px] left-0 w-full h-[1px] bg-black dark:bg-white transition-all duration-300 transform ease-in-out group-hover:w-1/3"></div>
          </div>
        </div>
      </div>
    </Link>
  );
};
