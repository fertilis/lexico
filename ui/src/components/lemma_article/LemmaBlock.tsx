"use client";

import commonStyles from "@/components/Common.module.css";

interface LemmaBlockProps {
  lemma: string;
  pos: string;
}

export default function LemmaBlock({lemma, pos}: LemmaBlockProps) {
  return (
    <div className={`${commonStyles.article_block} ${commonStyles.article_header}`}>
      {lemma}, <span className={commonStyles.annotation}>{pos.toLowerCase()}</span>
    </div>
  );
}

