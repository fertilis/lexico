"use client";

import {useParams, useRouter} from "next/navigation";
import {useEffect} from "react";
import {QueueType} from "@/domain/Queues";
import {setCurrentQueueType, useGetCurrentArticleIndex} from "@/redux_state/currentArticleSlice";
import {isStateInitialized} from "@/domain/utils";
import styles from "@/components/Common.module.css";
import {useDispatch} from "react-redux";

export default function ArticleTypePage() {
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();
  const queueType = params?.type as QueueType;
  const currentArcticleIndex = useGetCurrentArticleIndex(queueType);

  useEffect(() => {
    if (!isStateInitialized()) {
      router.push('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!isStateInitialized()) {
      return;
    }
    if (queueType && Object.values(QueueType).includes(queueType as QueueType)) {
      dispatch(setCurrentQueueType(queueType as QueueType));
    }
    if (currentArcticleIndex !== null) {
      router.push(`/article/${queueType}/${currentArcticleIndex}`);
    } else {
      router.push("/dictionary");
    }
  }, [currentArcticleIndex, queueType, router]);

  if (!isStateInitialized()) {
    return null;
  }

  return (
    <div className={styles.centering_expanded_box}>
      <div className={`${styles.centered_item} ${styles.message}`}>
        Loading...
      </div>
    </div>
  );
}

