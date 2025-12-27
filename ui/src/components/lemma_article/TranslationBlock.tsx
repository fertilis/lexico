"use client";

import styles from "@/components/Common.module.css";
import {Translation} from "@/domain/StoredDictionary";

interface TranslationBlockProps {
  translation: Translation | null;
}

export default function TranslationBlock({translation}: TranslationBlockProps) {
  if (!translation) {
    return null;
  }

  const englishTranslations = translation.en && translation.en.length > 0
    ? translation.en.join(", ")
    : null;
  const russianTranslations = translation.ru && translation.ru.length > 0
    ? translation.ru.join(", ")
    : null;

  if (!englishTranslations && !russianTranslations) {
    return null;
  }

  return (
    <div className={styles.article_block}>
      {englishTranslations && <p>{englishTranslations}</p>}
      {russianTranslations && <p>{russianTranslations}</p>}
    </div>
  );
}

