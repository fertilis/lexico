"use client";

import {useState, useEffect} from 'react';
import {QueueType, Queues} from '@/domain/Queues';
import styles from './DynamicArticle.module.css';

interface QueueSliderProps {
  queueType: QueueType;
  direction: 'forward' | 'backward';
  onValueChange: (rotation: number) => void;
}

export default function QueueSlider({queueType, direction, onValueChange}: QueueSliderProps) {
  const [value, setValue] = useState(0);
  const queueLength = Queues.instance.getLength(queueType);

  const rotation = direction === 'forward'
    ? -Math.floor(queueLength * value / 100)
    : Math.floor(queueLength * value / 100);

  useEffect(() => {
    setValue(0);
  }, [direction]);

  useEffect(() => {
    const articleIndex = Queues.instance.calculateFrontAfterRotation(queueType, rotation);
    if (articleIndex !== null) {
      onValueChange(rotation);
    }
  }, [rotation, queueType, onValueChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };


  const articleIndex = Queues.instance.calculateFrontAfterRotation(queueType, rotation) ?? 0;

  return (
    <div className={styles.queue_slider_container}>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className={styles.queue_slider}
      />
      <div className={styles.queue_slider_info}>
        <span>{Math.round(value)}% : {articleIndex}</span>
      </div>
    </div>
  );
}

