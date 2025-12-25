"use client";

import {Lemma, WordCard} from "@/domain/Dictionary";
import styles from "@/components/Common.module.css";

interface GrammarBlockProps {
  wordCard: WordCard;
}

export default function GrammarBlock({wordCard}: GrammarBlockProps) {
  const lemmas: Lemma[] = wordCard.getLemmas();
  const text = `Lemmas: ${lemmas.map(lemma => lemma.stored.lemma).join("; ")} `;
  return (
    <div className={styles.article_block}>
      <div>{text}</div>
    </div>
  );
}

