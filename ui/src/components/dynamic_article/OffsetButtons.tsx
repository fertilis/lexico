"use client";

import {useDispatch} from 'react-redux';
import {useRouter} from 'next/navigation';
import {QueueType, Queues, MoveOffset} from '@/domain/Queues';
import {setCurrentArticle} from '@/redux_state/currentArticleSlice';
import commonStyles from '../Common.module.css';
import styles from './DynamicArticle.module.css';

interface OffsetButtonsProps {
  queueType: QueueType;
}

export default function OffsetButtons({queueType}: OffsetButtonsProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleOffset = (offset: MoveOffset) => {
    Queues.instance.moveFrontByOffset(queueType, offset);
    dispatch(setCurrentArticle(queueType));
    const newIndex = Queues.instance.getFront(queueType);
    if (newIndex !== null) {
      router.push(`/article/${queueType}/${newIndex}`);
    }
  };

  return (
    <div className={styles.offset_buttons}>
      <button
        onClick={() => handleOffset(MoveOffset.Pop)}
        className={`${commonStyles.button} ${styles.contextual_button}`}
      >
        Pop
      </button>
      <button
        onClick={() => handleOffset(MoveOffset.Offset_1000)}
        className={`${commonStyles.button} ${styles.contextual_button}`}
      >
        1000
      </button>
      <button
        onClick={() => handleOffset(MoveOffset.Offset_100)}
        className={`${commonStyles.button} ${styles.contextual_button}`}
      >
        100
      </button>
      <button
        onClick={() => handleOffset(MoveOffset.Offset_10)}
        className={`${commonStyles.button} ${styles.contextual_button}`}
      >
        10
      </button>
    </div>
  );
}

