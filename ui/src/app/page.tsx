"use client";

import {useEffect, useState, useRef} from "react";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {useInitializeState} from "@/hooks/useInitializeState";
import {isStateInitialized} from "@/domain/utils";
import {useGetCurrentQueueType} from "@/redux_state/currentArticleSlice";
import {RootState} from "@/redux_state/store";
import commonStyles from "@/components/Common.module.css";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const hasInitialized = useRef(false);
  const hasRouted = useRef(false);
  const initializeState = useInitializeState();
  const [isInitialized, setIsInitialized] = useState(isStateInitialized());
  const currentQueueType = useGetCurrentQueueType();
  const currentArticlesMap = useSelector((state: RootState) => state.currentArticle.currentArticles);
  const currentArticleIndex = currentQueueType !== null ? (currentArticlesMap.get(currentQueueType) ?? null) : null;

  useEffect(() => {
    // Prevent multiple initializations
    if (!isInitialized && !hasInitialized.current) {
      hasInitialized.current = true;
      setIsLoading(true);
      initializeState()
        .then(() => {
          setIsLoading(false);
          setIsInitialized(isStateInitialized());
        })
        .catch((error) => {
          setIsLoading(false);
          hasInitialized.current = false; // Allow retry
        });
      return;
    }

    // Prevent multiple routes
    if (isInitialized && !hasRouted.current) {
      hasRouted.current = true;
      if (currentQueueType) {
        if (currentArticleIndex !== null) {
          router.push(`/article/${currentQueueType}/${currentArticleIndex}`);
        } else {
          router.push("/menu");
        }
      } else {
        router.push("/menu");
      }
    }
  }, [isInitialized, currentQueueType, currentArticleIndex, router, initializeState]);

  if (isLoading || !isInitialized) {
    return (
      <div className={styles.welcome_container}>
        <div className={commonStyles.message}>Loading database...</div>
      </div>
    );
  }
  return (
    <div className={styles.welcome_container}>
      <div className={commonStyles.message}>Redirecting...</div>
    </div>
  );
}
