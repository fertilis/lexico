"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCurrentQueueType, useGetCurrentArticleIndex } from '@/redux_state/currentArticleSlice';
import DynamicArticle from '@/components/dynamic_article/DynamicArticle';
import { isStateInitialized } from '@/domain/utils';

export default function ArticlePage() {
  const router = useRouter();
  const queueType = useGetCurrentQueueType();
  const articleIndex = queueType ? useGetCurrentArticleIndex(queueType) : null;

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

