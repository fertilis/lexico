"use client";

import {Lemma} from "@/domain/Dictionary";

interface AdjectiveGrammarProps {
  lemma: Lemma;
}

export default function AdjectiveGrammar({lemma}: AdjectiveGrammarProps) {
  const wordCount = lemma.stored.word_indices.length;
  return <div>Word count: {wordCount}</div>;
}

