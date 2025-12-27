"use client";

import styles from "./GrammarBlock.module.css";
import commonStyles from "@/components/Common.module.css";
import {Lemma} from "@/domain/Dictionary";
import {PartOfSpeechEnglish} from "@/domain/StoredDictionary";
import VerbGrammar from "./grammar/VerbGrammar";
import NounGrammar from "./grammar/NounGrammar";
import AdjectiveGrammar from "./grammar/AdjectiveGrammar";
import PronounGrammar from "./grammar/PronounGrammar";
import MonoformGrammar from "./grammar/MonoformGrammar";

interface GrammarBlockProps {
  lemma: Lemma;
}

export default function GrammarBlock({lemma}: GrammarBlockProps) {
  const pos = lemma.stored.pos_en;

  let GrammarComponent: React.ComponentType<{lemma: Lemma}>;
  switch (pos) {
    case PartOfSpeechEnglish.VERB:
      GrammarComponent = VerbGrammar;
      break;
    case PartOfSpeechEnglish.NOUN:
    case PartOfSpeechEnglish.PROPN:
      GrammarComponent = NounGrammar;
      break;
    case PartOfSpeechEnglish.ADJ:
      GrammarComponent = AdjectiveGrammar;
      break;
    case PartOfSpeechEnglish.PRON:
      GrammarComponent = PronounGrammar;
      break;
    default:
      GrammarComponent = MonoformGrammar;
      break;
  }

  return (
    <div className={`${styles.grammar_block} ${commonStyles.article_block}`}>
      <GrammarComponent lemma={lemma} />
    </div>
  );
}

