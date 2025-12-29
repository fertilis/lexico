"use client";

import {useRouter} from 'next/navigation';
import {Lemma} from '@/domain/Dictionary';
import {QueueType} from '@/domain/Queues';
import commonStyles from '@/components/Common.module.css';
import styles from './LemmaLink.module.css';

interface LemmaLinkProps {
  referrerQueueType: QueueType;
  referrerArticleIndex: number;
  lemma: Lemma;
  lemmaIndex: number;
}

export default function LemmaLink({
  referrerQueueType,
  referrerArticleIndex,
  lemma,
  lemmaIndex
}: LemmaLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    // Construct referrer path and query
    const referrerSearchParams = new URLSearchParams();
    referrerSearchParams.set('queueType', referrerQueueType);
    referrerSearchParams.set('articleIndex', referrerArticleIndex.toString());
    referrerSearchParams.set('displayStageMax', "1");
    const referrerPathAndQuery = `/article?${referrerSearchParams.toString()}`;

    // Navigate to lemma preview
    const lemmaPreviewSearchParams = new URLSearchParams();
    lemmaPreviewSearchParams.set('lemmaArticleIndex', lemmaIndex.toString());
    lemmaPreviewSearchParams.set('referrerPathAndQuery', referrerPathAndQuery);
    router.push(`/lemma-preview?${lemmaPreviewSearchParams.toString()}`);
  };

  const storedLemma = lemma.stored;

  return (
    <button
      onClick={handleClick}
      className={`${commonStyles.button} ${styles.lemma_link}`}
    >
      {storedLemma.lemma}, <span className={commonStyles.annotation}>{storedLemma.pos_en.toLowerCase()}</span>
    </button>
  );
}

