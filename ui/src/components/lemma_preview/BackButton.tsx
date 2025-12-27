"use client";

import { useRouter } from 'next/navigation';
import commonStyles from '@/components/Common.module.css';
import styles from './LemmaPreview.module.css';

interface BackButtonProps {
  referrerPathAndQuery: string;
}

export default function BackButton({ referrerPathAndQuery }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(referrerPathAndQuery);
  };

  return (
    <button
      onClick={handleClick}
      className={`${commonStyles.button} ${styles.back_button}`}
    >
      Back
    </button>
  );
}

