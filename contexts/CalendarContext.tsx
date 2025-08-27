'use client';

import { DateTime } from 'luxon';
import React, { createContext, useContext, useState } from 'react';

interface CalendarContextType {
  currentDateTime: DateTime;
  selectedDateTime: DateTime;
  weekNumber: number;
  startOfEndOfWeek: {
    startOfWeek: DateTime;
    endOfWeek: DateTime;
  };
  weekDays: DateTime[];
  isToday: (date: DateTime) => boolean;
  isBeforeToday: (date: DateTime) => boolean;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToToday: () => void;
  isCurrentWeek: () => boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      'useCalendarContext must be used within a CalendarProvider'
    );
  }
  return context;
};

interface CalendarProviderProps {
  children: React.ReactNode;
  currentDateTime: DateTime;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
  currentDateTime,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState(() =>
    DateTime.now().startOf('day')
  );

  const startOfEndOfWeek = {
    startOfWeek: selectedDateTime.startOf('week'),
    endOfWeek: selectedDateTime.endOf('week'),
  };

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    startOfEndOfWeek.startOfWeek.plus({ days: i })
  );

  const isCurrentWeek = () => {
    return selectedDateTime.hasSame(currentDateTime, 'week');
  };

  const isToday = (dateTime: DateTime) => {
    return dateTime.hasSame(currentDateTime, 'day');
  };

  const isBeforeToday = (dateTime: DateTime) => {
    if (dateTime.hasSame(currentDateTime, 'day')) return false;
    return dateTime < currentDateTime;
  };

  const goToNextWeek = () => {
    setSelectedDateTime(prev => prev.plus({ weeks: 1 }));
  };

  const goToPreviousWeek = () => {
    setSelectedDateTime(prev => prev.minus({ weeks: 1 }));
  };

  const goToToday = () => {
    setSelectedDateTime(currentDateTime);
  };

  const value: CalendarContextType = {
    currentDateTime,
    selectedDateTime,
    weekNumber: selectedDateTime.weekNumber,
    startOfEndOfWeek,
    weekDays,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    isCurrentWeek,
    isToday,
    isBeforeToday,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
