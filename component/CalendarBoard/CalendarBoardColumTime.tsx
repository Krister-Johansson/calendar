import { DateTime } from 'luxon';
import CalendarBoardColumTimeSlot, {
  type TimeSlot,
} from './CalendarBoardColumTimeSlot';
import { cn } from '../../lib/utils';

interface CalendarBoardColumTimeProps {
  date: DateTime;
  slots: TimeSlot[];
  isToday: boolean;
  isDisabled: boolean;
}

const CalendarBoardColumTime = ({
  date,
  slots,
  isToday,
  isDisabled,
}: CalendarBoardColumTimeProps) => {
  return (
    <div
      key={date.toISODate()}
      className={cn(
        'border-r border-gray-200 last:border-r-0 relative ',
        isToday ? 'bg-blue-50' : '',
        isDisabled ? 'opacity-50' : ''
      )}
    >
      <div className="absolute inset-0 bg-blue-50/30 pointer-events-none"></div>

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }, (_, hour) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-gray-100"
            style={{ top: `${(hour / 24) * 100}%` }}
          >
            {hour % 6 === 0 && (
              <span className="text-xs text-gray-400 ml-1 hidden md:inline">
                {hour.toString().padStart(2, '0')}:00
              </span>
            )}
          </div>
        ))}
      </div>
      <CalendarBoardColumTimeSlot
        slots={slots}
        date={date}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default CalendarBoardColumTime;
