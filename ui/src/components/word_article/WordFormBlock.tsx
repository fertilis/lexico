"use client";

import styles from "@/components/Common.module.css";
import articleStyles from "./WordArticle.module.css";

interface WordFormBlockProps {
  wordForm: string;
}

export default function WordFormBlock({wordForm: form}: WordFormBlockProps) {
  return (
    <div className={`${styles.article_block} ${articleStyles.word_form_block} `}>
      {form}
    </div>
  );
}

