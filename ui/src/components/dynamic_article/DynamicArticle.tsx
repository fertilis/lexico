"use client";

import {useEffect, useState} from 'react';
import {Dictionary, WordCard} from '@/domain/Dictionary';
import {QueueType} from '@/domain/Queues';
import WordArticle from '../word_article/WordArticle';
import ShiftButton, {ShiftType} from './ShiftButton';
import QueueSlider from './QueueSlider';
import ContextualControls from './ContextualControls';
import commonStyles from '../Common.module.css';
import styles from './DynamicArticle.module.css';
import {getMaxStage} from './utils';

interface DynamicArticleProps {
  queueType: string;
  currentArticleIndex: number;
}

export default function DynamicArticle({queueType, currentArticleIndex}: DynamicArticleProps) {
  const [displayStage, setDisplayStage] = useState(0);
  const [queueSliderVisible, setQueueSliderVisible] = useState(false);
  const [queueSliderDirection, setQueueSliderDirection] = useState<'forward' | 'backward'>('forward');
  const [queueSliderRotation, setQueueSliderRotation] = useState(0);

  const queueTypeEnum = queueType as QueueType;
  const maxStage = getMaxStage(queueTypeEnum);

  // Reset displayStage to 0 whenever navigation occurs (currentArticleIndex changes)
  useEffect(() => {
    setDisplayStage(0);
  }, [currentArticleIndex]);

  let wordCard: WordCard | null = null;
  if (queueType === QueueType.WordsCards) {
    try {
      wordCard = Dictionary.instance.getWordCard(currentArticleIndex);
    } catch (error) {
      console.error('Failed to get word:', error);
    }
  }

  const handleIncrementDisplayStage = () => {
    setDisplayStage(prev => {
      if (prev < maxStage) {
        return prev + 1;
      }
      return prev;
    });
  };

  const handleShowSlider = (direction: 'forward' | 'backward') => {
    setQueueSliderDirection(direction);
    setQueueSliderVisible(true);
  };

  const handleSliderValueChange = (rotation: number) => {
    setQueueSliderRotation(rotation);
  };

  const handleHideSlider = () => {
    setQueueSliderVisible(false);
  };

  return (
    <div className={styles.dynamic_article_container}>
      <ShiftButton
        queueType={queueTypeEnum}
        shiftType={ShiftType.Backward}
        onShowSlider={() => handleShowSlider('backward')}
      />
      <div className={styles.middle_area}>
        <div className={styles.article_area}>
          {queueType === QueueType.WordsCards && wordCard ? (
            <WordArticle wordCard={wordCard} displayStage={displayStage} />
          ) : (
            <div className={commonStyles.article_block}>
              <p>Stub: Type: {queueType}, Index: {currentArticleIndex}</p>
            </div>
          )}
        </div>
        {queueSliderVisible && (
          <QueueSlider
            queueType={queueTypeEnum}
            direction={queueSliderDirection}
            onValueChange={handleSliderValueChange}
          />
        )}
        <ContextualControls
          queueType={queueTypeEnum}
          displayStage={displayStage}
          queueSliderVisible={queueSliderVisible}
          queueSliderRotation={queueSliderRotation}
          onIncrementDisplayStage={handleIncrementDisplayStage}
          onApply={handleHideSlider}
        />
      </div>
      <ShiftButton
        queueType={queueTypeEnum}
        shiftType={ShiftType.Forward}
        onShowSlider={() => handleShowSlider('forward')}
      />
    </div>
  );
}

