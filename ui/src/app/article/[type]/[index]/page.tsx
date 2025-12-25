"use client";

import {useEffect} from 'react';
import {useRouter, useParams} from 'next/navigation';
import {useDispatch} from 'react-redux';
import DynamicArticle from '@/components/dynamic_article/DynamicArticle';
import {isStateInitialized} from '@/domain/utils';

export default function ArticlePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const type = params?.type as string;
  const index = params?.index as string;
  const indexNum = parseInt(index, 10);

  useEffect(() => {
    if (!isStateInitialized()) {
      router.push('/');
      return;
    }
  }, [router, dispatch, type]);

  if (isNaN(indexNum)) {
    return <div>Invalid index: {index}</div>;
  }

  if (!isStateInitialized()) {
    return null;
  }

  return <DynamicArticle queueType={type} currentArticleIndex={indexNum} />;
}

