import { DateTime } from 'luxon';
import { cn } from '../../lib/utils';

const CalendarBoardColumHeader = ({
  date,
  isToday,
  isDisabled,
}: {
  date: DateTime;
  isToday: boolean;
  isDisabled: boolean;
}) => {
  return (
    <div
      className={cn(
        'p-1 md:p-3 text-center border-r border-gray-200 last:border-r-0',
        isToday ? 'bg-blue-50 text-blue-700' : '',
        isDisabled ? 'opacity-50' : ''
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
