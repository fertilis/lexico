"use client";

import {useDispatch} from 'react-redux';
import {useRouter} from 'next/navigation';
import {QueueType, Queues} from '@/domain/Queues';
import {setCurrentArticle} from '@/redux_state/currentArticleSlice';
import commonStyles from '../Common.module.css';
import styles from './DynamicArticle.module.css';

interface ApplyButtonProps {
  queueType: QueueType;
  rotation: number;
  onPress: () => void;
}

export default function ApplyButton({queueType, rotation, onPress}: ApplyButtonProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    Queues.instance.rotate(queueType, rotation);
    dispatch(setCurrentArticle(queueType));
    const newIndex = Queues.instance.getFront(queueType);
    if (newIndex !== null) {
      router.push(`/article/${queueType}/${newIndex}`);
    }
    onPress();
  };

  return (
    <button
      onClick={handleClick}
      className={`${commonStyles.button} ${styles.contextual_button}`}
    >
      Apply
    </button>
  );
}

