"use client";

import commonStyles from "@/components/Common.module.css";

interface WordFormBlockProps {
  wordForm: string;
}

export default function WordFormBlock({wordForm: form}: WordFormBlockProps) {
  return (
    <div className={`${commonStyles.article_block} ${commonStyles.article_header}`}>
      {form}
    </div>
  );
}

