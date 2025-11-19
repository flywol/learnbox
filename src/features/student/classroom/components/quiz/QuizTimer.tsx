import { useState, useEffect } from 'react';
import { TimerStatus } from '../../types/classroom.types';

interface QuizTimerProps {
  durationInMinutes: number;
  onTimeExpired: () => void;
  isPaused?: boolean;
}

export default function QuizTimer({
  durationInMinutes,
  onTimeExpired,
  isPaused = false
}: QuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60); // Convert to seconds

  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, onTimeExpired]);

  const getTimerStatus = (): TimerStatus => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return {
      hours,
      minutes,
      seconds,
      isExpired: timeRemaining <= 0
    };
  };

  const status = getTimerStatus();
  const isWarning = timeRemaining <= 300; // Last 5 minutes
  const isCritical = timeRemaining <= 60; // Last 1 minute

  return (
    <div className="flex flex-col items-center">
      <div
        className={`text-3xl font-bold transition-colors ${
          isCritical
            ? 'text-red-600'
            : isWarning
            ? 'text-orange-500'
            : 'text-gray-900'
        }`}
      >
        {String(status.minutes).padStart(2, '0')} : {String(status.seconds).padStart(2, '0')}
      </div>
      <div className="flex gap-8 text-xs text-gray-500 mt-1">
        <span>Minute</span>
        <span>Hour</span>
      </div>
    </div>
  );
}
