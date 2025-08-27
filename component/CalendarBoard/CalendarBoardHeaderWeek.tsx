import { useCalendarContext } from '../../contexts/CalendarContext';

const CalendarBoardHeaderWeek = () => {
  const { today, startOfEndOfWeek } = useCalendarContext();
  const isSameMonth =
    startOfEndOfWeek.startOfWeek.month === startOfEndOfWeek.endOfWeek.month;

  return (
    <div className="text-sm md:text-base text-gray-600 font-medium flex items-center gap-1">
      <span className="text-gray-800 font-bold">Week: {today.weekNumber}</span>

      {isSameMonth ? (
        <span>{startOfEndOfWeek.startOfWeek.toFormat('MMMM yyyy')}</span>
      ) : (
        <>
          <span>{startOfEndOfWeek.startOfWeek.toFormat('MMMM')}</span>
          <span>-</span>
          <span>{startOfEndOfWeek.endOfWeek.toFormat('MMMM yyyy')}</span>
        </>
      )}
    </div>
  );
};

export default CalendarBoardHeaderWeek;
