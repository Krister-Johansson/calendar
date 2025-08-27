'use client';

import { CalendarBoard } from '../component/CalendarBoard';
import { CalendarProvider } from '../contexts/CalendarContext';

export default function Home() {
  return (
    <CalendarProvider>
      <div className="min-h-screen bg-gray-50">
        <CalendarBoard />
      </div>
    </CalendarProvider>
  );
}
