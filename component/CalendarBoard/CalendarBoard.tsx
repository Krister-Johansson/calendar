'use client';
import CalendarBoardColum from './CalendarBoardColum';
import CalendarBoardFooter from './CalendarBoardFooter';
import CalendarBoardHeader from './CalendarBoardHeader';

const CalendarBoard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full min-h-[calc(100vh-2rem)]">
        <CalendarBoardHeader />
        <CalendarBoardColum />
        <CalendarBoardFooter />
      </div>
    </div>
  );
};

export default CalendarBoard;
