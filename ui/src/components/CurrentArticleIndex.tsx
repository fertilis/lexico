"use client";

import {usePathname} from "next/navigation";
import {useGetCurrentQueueType, useGetCurrentArticleIndex} from "@/redux_state/currentArticleSlice";

export default function CurrentArticleIndex() {
  const pathname = usePathname();
  const queueType = useGetCurrentQueueType();
  const articleIndex = useGetCurrentArticleIndex(queueType);

  if (!pathname.startsWith("/article") || articleIndex === null) {
    return null;
  }
  return (
    <div style={{textAlign: "center"}}>
      {articleIndex}
    </div>
  );
}

