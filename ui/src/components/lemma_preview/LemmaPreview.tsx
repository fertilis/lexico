"use client";

import { Dictionary } from '@/domain/Dictionary';
import LemmaArticle from '@/components/lemma_article/LemmaArticle';
import { LemmaArticleDisplayStage } from '@/components/lemma_article/LemmaArticleDisplayStage';
import BackButton from './BackButton';
import styles from './LemmaPreview.module.css';

interface LemmaPreviewProps {
  lemmaArticleIndex: number;
  referrerPathAndQuery: string;
}

export default function LemmaPreview({ lemmaArticleIndex, referrerPathAndQuery }: LemmaPreviewProps) {
  let lemma = null;
  try {
    lemma = Dictionary.instance.getLemma(lemmaArticleIndex);
  } catch (error) {
    console.error('Failed to get lemma:', error);
  }

  const maxDisplayStage = LemmaArticleDisplayStage.Grammar;

  return (
    <div className={styles.lemma_preview_container}>
      <div className={styles.article_area}>
        {lemma ? (
          <LemmaArticle lemma={lemma} displayStage={maxDisplayStage} />
        ) : (
          <div>Lemma not found</div>
        )}
      </div>
      <div className={styles.back_button_area}>
        <BackButton referrerPathAndQuery={referrerPathAndQuery} />
      </div>
    </div>
  );
}

