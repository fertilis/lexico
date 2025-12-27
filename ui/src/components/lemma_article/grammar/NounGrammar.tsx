"use client";

import {Lemma} from "@/domain/Dictionary";

interface NounGrammarProps {
  lemma: Lemma;
}

export default function NounGrammar({lemma}: NounGrammarProps) {
  const wordCount = lemma.stored.word_indices.length;
  return <div>Word count: {wordCount}</div>;
}

