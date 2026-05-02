"use client";

import type {Phrase} from "@/domain/StoredDictionary";
import commonStyles from "@/components/Common.module.css";
import styles from "@/components/word_article/WordArticle.module.css";
import PhraseBlock from "@/components/word_article/PhraseBlock";
import {PhraseSentenceDisplayStage} from "./PhraseSentenceDisplayStage";

interface PhraseSentenceArticleProps {
  phrase: Phrase;
  displayStage: number;
}

export default function PhraseSentenceArticle({
  phrase,
  displayStage,
}: PhraseSentenceArticleProps) {
  return (
    <div className={`${commonStyles.article_container} ${styles.word_article}`}>
      {displayStage >= PhraseSentenceDisplayStage.EnglishOnly && (
        <PhraseBlock phrase={phrase.english} language="english" />
      )}
      {displayStage >= PhraseSentenceDisplayStage.WithGreek && (
        <PhraseBlock phrase={phrase.greek} language="greek" />
      )}
    </div>
  );
}
