import { DateTime } from 'luxon';
import { cn } from '../../lib/utils';
import { useCalendarContext } from '../../contexts/CalendarContext';

const CalendarBoardColumHeader = ({ date }: { date: DateTime }) => {
  const { isToday, isBeforeToday } = useCalendarContext();
  return (
    <div
      className={cn(
        'p-1 md:p-2 text-center border-r border-gray-200 last:border-r-0',
        isToday(date) ? 'bg-blue-50 text-blue-700' : '',
        isBeforeToday(date) ? 'opacity-50' : ''
      )}
    >
      <div className={`text-sm md:text-base font-medium 'text-gray-700'}`}>
        <span className="sm:hidden">{date.toFormat('EEE')}</span>
        <span className="hidden sm:inline">{date.toFormat('EEEE')}</span>
      </div>
      <div
        className={`text-lg md:text-xl font-semibold mt-1  'text-gray-900'}`}
      >
        {date.day}
      </div>
    </div>
  );
};

export default CalendarBoardColumHeader;
