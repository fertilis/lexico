"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LemmaPreview from '@/components/lemma_preview/LemmaPreview';

function LemmaPreviewContent() {
  const searchParams = useSearchParams();
  
  const lemmaArticleIndexParam = searchParams.get('lemmaArticleIndex');
  const referrerPathAndQuery = searchParams.get('referrerPathAndQuery') || '/article';

  const lemmaArticleIndex = lemmaArticleIndexParam !== null 
    ? parseInt(lemmaArticleIndexParam, 10) 
    : null;

  if (lemmaArticleIndex === null || isNaN(lemmaArticleIndex) || lemmaArticleIndex < 0) {
    return <div>Invalid lemma article index</div>;
  }

  return (
    <LemmaPreview 
      lemmaArticleIndex={lemmaArticleIndex} 
      referrerPathAndQuery={referrerPathAndQuery}
    />
  );
}

export default function LemmaPreviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LemmaPreviewContent />
    </Suspense>
  );
}

