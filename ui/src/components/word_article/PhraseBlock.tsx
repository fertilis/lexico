"use client";

import React from "react";
import styles from "@/components/Common.module.css";

interface PhraseBlockProps {
  phrase: string;
  language: "greek" | "english";
  wordForm: string;
}

export default function PhraseBlock({phrase, language, wordForm}: PhraseBlockProps) {
  return (
    <div className={`${styles.article_block} ${styles.left_aligned}`}>
      <div>{language === "greek" ? highlightWord(phrase, wordForm) : phrase}</div>
    </div>
  );
}


function highlightWord(phrase: string, wordForm: string): React.ReactNode {
  // Search for all occurrences of word form in the phrase and highlight them
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let searchIndex = 0;

  while (true) {
    const index = phrase.indexOf(wordForm, searchIndex);
    if (index === -1) {
      // No more matches, add the rest of the phrase
      if (lastIndex < phrase.length) {
        parts.push(phrase.substring(lastIndex));
      }
      break;
    }

    // Add text before the match
    if (index > lastIndex) {
      parts.push(phrase.substring(lastIndex, index));
    }

    // Add highlighted match
    parts.push(
      <span key={index} className={styles.highlighted_text}>
        {wordForm}
      </span>
    );

    lastIndex = index + wordForm.length;
    searchIndex = index + 1;
  }

  return parts.length > 0 ? <>{parts}</> : phrase;
}
