"use client";

import {WordCard} from "@/domain/Dictionary";
import {Phrase, StoredWordCard} from "@/domain/StoredDictionary";
import styles from "../Common.module.css";
import {WordArticleDisplayStage} from "./WordArticleDisplayStage";
import WordFormBlock from "./WordFormBlock";
import PhraseBlock from "./PhraseBlock";

interface WordArticleProps {
  wordCard: WordCard;
  displayStage: number;
}

export default function WordArticle({wordCard, displayStage}: WordArticleProps) {
  const storedWordCard: StoredWordCard = wordCard.stored;
  const phrase: Phrase | null = storedWordCard.phrases.length > 0 ? storedWordCard.phrases[0] : null;

  return (
    <div className={styles.article_container}>
      {displayStage >= WordArticleDisplayStage.WordForm && (
        <WordFormBlock wordForm={storedWordCard.form} />
      )}
      {displayStage >= WordArticleDisplayStage.GreekPhrase && phrase && (
        <PhraseBlock phrase={phrase.greek} language="greek" wordForm={storedWordCard.form} />
      )}
      {displayStage >= WordArticleDisplayStage.EnglishPhrase && phrase && (
        <PhraseBlock phrase={phrase.english} language="english" wordForm={storedWordCard.form} />
      )}
    </div>
  );
}

