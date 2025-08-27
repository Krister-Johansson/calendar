'use client';

import { CalendarBoard } from '../component/CalendarBoard';
import { CalendarProvider } from '../contexts/CalendarContext';
import { useTick } from '../hooks/useTick';

export default function Home() {
  const { currentDateTime } = useTick({ interval: 10, tick: 'Second' });
  console.log(currentDateTime);
  return (
    <CalendarProvider currentDateTime={currentDateTime}>
      <div className="h-screen bg-gray-50 flex flex-col">
        <CalendarBoard />
      </div>
    </CalendarProvider>
  );
}
