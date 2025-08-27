'use client';

import { CalendarBoard } from '../component/CalendarBoard';
import { CalendarProvider } from '../contexts/CalendarContext';

export default function Home() {
  return (
    <CalendarProvider>
      <CalendarBoard />
    </CalendarProvider>
  );
}
