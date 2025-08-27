import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';

type Tick = 'Hour' | 'Minute' | 'Second';
interface UseTickProps {
  interval: number;
  tick: Tick;
}

const getDelay = (interval: number, tick: Tick): number => {
  switch (tick) {
    case 'Hour':
      return interval * 60 * 60 * 1000;
    case 'Minute':
      return interval * 60 * 1000;
    case 'Second':
      return interval * 1000;
  }
  return interval;
};

export const useTick = ({ interval, tick }: UseTickProps) => {
  const [currentDateTime, setCurrentDateTime] = useState<DateTime>(
    DateTime.now()
  );
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timer.current = setInterval(
      () => {
        setCurrentDateTime(DateTime.now());
      },
      getDelay(interval, tick)
    );

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [interval, tick]);

  return { currentDateTime };
};
