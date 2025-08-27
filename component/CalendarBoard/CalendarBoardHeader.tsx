import CalendarBoardHeaderNavigate from './CalendarBoardHeaderNavigate';
import CalendarBoardHeaderWeek from './CalendarBoardHeaderWeek';

const CalendarBoardHeader = () => {
  return (
    <div className="flex items-center justify-between p-2 md:p-2 border-b border-gray-200 bg-gray-50">
      <div className="text-sm md:text-base text-gray-600 font-medium">
        Room: Washroom
      </div>
      <CalendarBoardHeaderWeek />
      <CalendarBoardHeaderNavigate />
    </div>
  );
};

export default CalendarBoardHeader;
