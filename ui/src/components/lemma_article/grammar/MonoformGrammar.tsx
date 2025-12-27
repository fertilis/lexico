"use client";

import {Lemma} from "@/domain/Dictionary";

interface MonoformGrammarProps {
  lemma: Lemma;
}

export default function MonoformGrammar({lemma}: MonoformGrammarProps) {
  const wordCount = lemma.stored.word_indices.length;
  return <div>Word count: {wordCount}</div>;
}

