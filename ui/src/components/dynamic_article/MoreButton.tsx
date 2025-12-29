"use client";

import commonStyles from '@/components/Common.module.css';
import styles from './DynamicArticle.module.css';

interface MoreButtonProps {
  onIncrement: () => void;
}

export default function MoreButton({onIncrement}: MoreButtonProps) {
  return (
    <button
      onClick={onIncrement}
      className={`${commonStyles.button} ${styles.contextual_button}`}
    >
      More
    </button>
  );
}

