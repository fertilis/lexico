"use client";

import {Lemma} from "@/domain/Dictionary";

interface PronounGrammarProps {
  lemma: Lemma;
}

export default function PronounGrammar({lemma}: PronounGrammarProps) {
  const wordCount = lemma.stored.word_indices.length;
  return <div>Word count: {wordCount}</div>;
}

