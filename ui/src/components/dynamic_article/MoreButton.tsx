"use client";

import commonStyles from '../Common.module.css';
import styles from './DynamicArticle.module.css';

interface MoreButtonProps {
  onIncrement: () => void;
}

export default function MoreButton({onIncrement}: MoreButtonProps) {
  return (
    <button
      onClick={onIncrement}
      className={`${commonStyles.button} ${styles.more_button}`}
    >
      More
    </button>
  );
}

