"use client";

import {QueueType} from '@/domain/Queues';
import {WordArticleDisplayStage} from '../word_article/WordArticleDisplayStage';
import ApplyButton from './ApplyButton';
import MoreButton from './MoreButton';
import OffsetButtons from './OffsetButtons';
import styles from './DynamicArticle.module.css';
import {getMaxStage} from './utils';

interface ContextualControlsProps {
  queueType: QueueType;
  displayStage: WordArticleDisplayStage;
  queueSliderVisible: boolean;
  queueSliderRotation: number;
  onIncrementDisplayStage: () => void;
  onApply: () => void;
}

export default function ContextualControls({
  queueType,
  displayStage,
  queueSliderVisible,
  queueSliderRotation,
  onIncrementDisplayStage,
  onApply,
}: ContextualControlsProps) {
  const maxStage = getMaxStage(queueType);
  const isMaxStage = displayStage >= maxStage;

  return (
    <div className={styles.contextual_controls}>
      {queueSliderVisible && (
        <ApplyButton
          queueType={queueType}
          rotation={queueSliderRotation}
          onPress={onApply}
        />
      )}
      {!queueSliderVisible && !isMaxStage && (
        <MoreButton onIncrement={onIncrementDisplayStage} />
      )}
      {!queueSliderVisible && isMaxStage && (
        <OffsetButtons queueType={queueType} />
      )}
    </div>
  );
}


