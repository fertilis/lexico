"use client";

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetCurrentQueueType, useGetCurrentArticleIndex, setCurrentQueueType, setCurrentArticleIndex } from '@/redux_state/currentArticleSlice';
import { useDispatch } from 'react-redux';
import DynamicArticle from '@/components/dynamic_article/DynamicArticle';
import { isStateInitialized } from '@/domain/utils';
import { QueueType } from '@/domain/Queues';

export default function ArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const reduxQueueType = useGetCurrentQueueType();
  const reduxArticleIndex = useGetCurrentArticleIndex(reduxQueueType);

  // Parse query params
  const queryQueueType = searchParams.get('queueType');
  const queryArticleIndex = searchParams.get('articleIndex');

  // Determine which values to use: query params take precedence if provided
  const queueType = useMemo(() => {
    if (queryQueueType) {
      // Validate that queryQueueType is a valid QueueType
      const validQueueTypes = Object.values(QueueType);
      if (validQueueTypes.includes(queryQueueType as QueueType)) {
        return queryQueueType as QueueType;
      }
    }
    return reduxQueueType;
  }, [queryQueueType, reduxQueueType]);

  const articleIndex = useMemo(() => {
    if (queryArticleIndex !== null) {
      const parsed = parseInt(queryArticleIndex, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        return parsed;
      }
    }
    return reduxArticleIndex;
  }, [queryArticleIndex, reduxArticleIndex]);

  // Update Redux state if query params are provided
  useEffect(() => {
    if (queryQueueType && Object.values(QueueType).includes(queryQueueType as QueueType)) {
      dispatch(setCurrentQueueType(queryQueueType as QueueType));
    }
  }, [queryQueueType, dispatch]);

  useEffect(() => {
    if (queryArticleIndex !== null && queueType) {
      const parsed = parseInt(queryArticleIndex, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        dispatch(setCurrentArticleIndex({queueType, articleIndex: parsed}));
      }
    }
  }, [queryArticleIndex, queueType, dispatch]);

  useEffect(() => {
    if (!isStateInitialized()) {
      router.push('/');
      return;
    }
    if (!queueType || articleIndex === null) {
      router.push('/menu');
      return;
    }
  }, [router, queueType, articleIndex]);

  if (!isStateInitialized() || !queueType || articleIndex === null) {
    return null;
  }

  return <DynamicArticle queueType={queueType} currentArticleIndex={articleIndex} />;
}

