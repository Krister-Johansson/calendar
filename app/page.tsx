'use client';

import { CalendarBoard } from '../component/CalendarBoard';
import { CalendarProvider } from '../contexts/CalendarContext';
import { useTick } from '../hooks/useTick';

export default function Home() {
  const { currentDateTime } = useTick({ interval: 10, tick: 'Second' });
  console.log(currentDateTime);
  return (
    <CalendarProvider currentDateTime={currentDateTime}>
      <div className="min-h-screen bg-gray-50">
        <CalendarBoard />
      </div>
    </CalendarProvider>
  );
}
