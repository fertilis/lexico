"use client";

import {Lemma} from "@/domain/Dictionary";

interface VerbGrammarProps {
  lemma: Lemma;
}

export default function VerbGrammar({lemma}: VerbGrammarProps) {
  const wordCount = lemma.stored.word_indices.length;
  return <div>Word count: {wordCount}</div>;
}

