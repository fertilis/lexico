"use client";

import {WordCard, Dictionary} from "@/domain/Dictionary";
import {Phrase, StoredWordCard} from "@/domain/StoredDictionary";
import commonStyles from "@/components/Common.module.css";
import styles from "./WordArticle.module.css";
import {WordArticleDisplayStage} from "./WordArticleDisplayStage";
import WordFormBlock from "./WordFormBlock";
import PhraseBlock from "./PhraseBlock";
import LemmaLink from "@/components/LemmaLink";
import {QueueType} from "@/domain/Queues";
import {useGetCurrentQueueType, useGetCurrentArticleIndex} from "@/redux_state/currentArticleSlice";

interface WordArticleProps {
  wordCard: WordCard;
  displayStage: number;
}

export default function WordArticle({wordCard, displayStage}: WordArticleProps) {
  const storedWordCard: StoredWordCard = wordCard.stored;
  const phrase: Phrase | null = storedWordCard.phrases.length > 0 ? storedWordCard.phrases[0] : null;

  // Get current queueType and articleIndex from Redux state for referrer
  const currentQueueType = useGetCurrentQueueType();
  const referrerQueueType = currentQueueType || QueueType.WordsCards;
  const referrerArticleIndexFromState = useGetCurrentArticleIndex(currentQueueType);
  const referrerArticleIndex = referrerArticleIndexFromState !== null ? referrerArticleIndexFromState : 0;

  // Get lemmas for the word card
  const lemmas = wordCard.getLemmas();
  const lemmaIndices = storedWordCard.lemma_indices;

  return (
    <div className={`${commonStyles.article_container} ${styles.word_article}`}>
      {displayStage >= WordArticleDisplayStage.WordForm && (
        <WordFormBlock wordForm={storedWordCard.form} />
      )}
      {displayStage >= WordArticleDisplayStage.GreekPhrase && phrase && (
        <PhraseBlock phrase={phrase.greek} language="greek" wordForm={storedWordCard.form} />
      )}
      {displayStage >= WordArticleDisplayStage.EnglishPhrase && phrase && (
        <PhraseBlock phrase={phrase.english} language="english" wordForm={storedWordCard.form} />
      )}
      {displayStage >= WordArticleDisplayStage.EnglishPhrase && lemmas.length > 0 && (
        <div className={commonStyles.article_block}>
          {lemmas.map((lemma, index) => (
            <LemmaLink
              key={lemmaIndices[index]}
              referrerQueueType={referrerQueueType}
              referrerArticleIndex={referrerArticleIndex}
              lemma={lemma}
              lemmaIndex={lemmaIndices[index]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

