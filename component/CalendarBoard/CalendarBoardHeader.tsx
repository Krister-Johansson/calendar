import CalendarBoardHeaderNavigate from './CalendarBoardHeaderNavigate';
import CalendarBoardHeaderWeek from './CalendarBoardHeaderWeek';

const CalendarBoardHeader = () => {
  return (
    <header className="flex items-center justify-between p-2 md:p-2 border-b border-gray-200 bg-gray-50">
      <div className="text-sm md:text-base text-gray-600 font-medium">
        <span className="hidden md:inline">Room: </span>Washing Room
      </div>
      <CalendarBoardHeaderWeek />
      <CalendarBoardHeaderNavigate />
    </header>
  );
};

export default CalendarBoardHeader;
