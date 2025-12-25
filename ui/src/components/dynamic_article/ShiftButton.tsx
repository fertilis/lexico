"use client";

import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/navigation';
import {QueueType, Queues} from '@/domain/Queues';
import {setCurrentArticle} from '@/redux_state/currentArticleSlice';
import commonStyles from '../Common.module.css';
import styles from './DynamicArticle.module.css';

export enum ShiftType {
  Forward = 'forward',
  Backward = 'backward',
}

interface ShiftButtonProps {
  queueType: QueueType;
  shiftType: ShiftType;
  onShowSlider: () => void;
}

export default function ShiftButton({queueType, shiftType, onShowSlider}: ShiftButtonProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sliderShownRef = useRef(false);

  const handleMouseDown = () => {
    sliderShownRef.current = false;
    holdTimeoutRef.current = setTimeout(() => {
      sliderShownRef.current = true;
      onShowSlider();
    }, 1000);
  };

  const handleMouseUp = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if slider was shown
    if (sliderShownRef.current) {
      e.preventDefault();
      return;
    }
    if (shiftType === ShiftType.Forward) {
      Queues.instance.frontToBack(queueType);
    } else {
      Queues.instance.backToFront(queueType);
    }
    dispatch(setCurrentArticle(queueType));
    router.push('/article');
  };

  const getButtonClass = () => {
    const baseClass = `${commonStyles.button} ${styles.nav_button}`;
    if (shiftType === ShiftType.Forward) {
      return `${baseClass} ${styles.nav_button_forward}`;
    } else {
      return `${baseClass} ${styles.nav_button_back}`;
    }
  };

  const getAriaLabel = () => {
    return shiftType === ShiftType.Forward ? "Next article" : "Previous article";
  };

  const getSvgPath = () => {
    if (shiftType === ShiftType.Forward) {
      return "m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z";
    } else {
      return "M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z";
    }
  };

  return (
    <button
      className={getButtonClass()}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onClick={handleClick}
      aria-label={getAriaLabel()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
        className={commonStyles.button_icon}
      >
        <path d={getSvgPath()} />
      </svg>
    </button>
  );
}

