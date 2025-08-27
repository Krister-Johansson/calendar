import React, { createContext, useContext, ReactNode } from 'react';
import { DateTime } from 'luxon';
import useCalendarBoard, {
  StartOfWeek,
  UseCalendarBoardReturn,
} from '../hooks/useCalendarBoard';

const CalendarContext = createContext<UseCalendarBoardReturn | undefined>(
  undefined
);

interface CalendarProviderProps {
  children: ReactNode;
  initialDate?: DateTime;
  weekStart?: StartOfWeek;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
  initialDate = DateTime.now(),
  weekStart = StartOfWeek.Monday,
}) => {
  const calendarBoard = useCalendarBoard({ date: initialDate, weekStart });

  return (
    <CalendarContext.Provider value={calendarBoard}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = (): UseCalendarBoardReturn => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
