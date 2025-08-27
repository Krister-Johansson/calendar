import { DateTime } from 'luxon';
import { useState } from 'react';

export interface UseCalendarBoardProps {
  date: DateTime;
  weekStart: StartOfWeek;
}

export interface UseCalendarBoardReturn {
  today: DateTime;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleToday: () => void;
  isSameWeek: () => boolean;
  isBeforeToday: (date: DateTime) => boolean;
  isToday: (date: DateTime) => boolean;
  weekDays: DateTime[];
  startOfEndOfWeek: { startOfWeek: DateTime; endOfWeek: DateTime };
}

export enum StartOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}

const getWeekDays = (
  date: DateTime = DateTime.now(),
  startOfWeek: StartOfWeek = StartOfWeek.Monday
): DateTime[] => {
  const weekday = date.weekday;

  const luxonStart = startOfWeek === StartOfWeek.Sunday ? 7 : startOfWeek;

  const diff = weekday - luxonStart;
  const start = date.minus({ days: diff >= 0 ? diff : 7 + diff });

  return Array.from({ length: 7 }, (_, i) => start.plus({ days: i }));
};

const isToday = (date: DateTime): boolean => {
  return date.hasSame(DateTime.now(), 'day');
};

const isBeforeToday = (date: DateTime): boolean => {
  return !isToday(date) && date < DateTime.now();
};

const isSameWeek = (date: DateTime): boolean => {
  return date.hasSame(DateTime.now(), 'week');
};

const getMonthsFromWeek = (
  date: DateTime
): { startOfWeek: DateTime; endOfWeek: DateTime } => {
  const startOfWeek = date.startOf('week');
  const endOfWeek = date.endOf('week');
  return { startOfWeek, endOfWeek };
};

const useCalendarBoard = ({ date, weekStart }: UseCalendarBoardProps) => {
  const [today, setToday] = useState(date);
  const handlePrevWeek = () => {
    if (isSameWeek(today)) return;
    setToday(today.minus({ weeks: 1 }));
  };
  const handleNextWeek = () => {
    setToday(today.plus({ weeks: 1 }));
  };

  const handleToday = () => {
    setToday(DateTime.now());
  };

  return {
    today,
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    isBeforeToday: (date: DateTime) => isBeforeToday(date),
    isSameWeek: () => isSameWeek(today),
    isToday: (date: DateTime) => isToday(date),
    weekDays: getWeekDays(today, weekStart),
    startOfEndOfWeek: getMonthsFromWeek(today),
  };
};

export default useCalendarBoard;
