"use client";

import {Lemma} from "@/domain/Dictionary";
import styles from "@/components/Common.module.css";
import {LemmaArticleDisplayStage} from "./LemmaArticleDisplayStage";
import LemmaBlock from "./LemmaBlock";
import TranslationBlock from "./TranslationBlock";
import GrammarBlock from "./GrammarBlock";

interface LemmaArticleProps {
  lemma: Lemma;
  displayStage: number;
}

export default function LemmaArticle({lemma, displayStage}: LemmaArticleProps) {
  const storedLemma = lemma.stored;

  return (
    <div className={styles.article_container}>
      {displayStage >= LemmaArticleDisplayStage.Lemma && (
        <LemmaBlock lemma={storedLemma.lemma} pos={storedLemma.pos_en} />
      )}
      {displayStage >= LemmaArticleDisplayStage.Translation && (
        <TranslationBlock translation={storedLemma.translation} />
      )}
      {displayStage >= LemmaArticleDisplayStage.Grammar && (
        <GrammarBlock lemma={lemma} />
      )}
    </div>
  );
}

