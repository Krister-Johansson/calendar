import { DateTime } from 'luxon';
import { cn } from '../../lib/utils';
import CalendarBoardColumTimeSlot, {
  type TimeSlot,
} from './CalendarBoardColumTimeSlot';
import { useCalendarContext } from '../../contexts/CalendarContext';

interface CalendarBoardColumTimeProps {
  date: DateTime;
  slots: TimeSlot[];
}

const CalendarBoardColumTime = ({
  date,
  slots,
}: CalendarBoardColumTimeProps) => {
  const { isToday } = useCalendarContext();
  return (
    <div
      key={date.toISODate()}
      className={cn(
        'border-r border-gray-200 last:border-r-0 relative ',
        isToday(date) ? 'bg-blue-50' : ''
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
              <span className="text-xs text-gray-400 ml-1 md:inline">
                {hour.toString().padStart(2, '0')}:00
              </span>
            )}
          </div>
        ))}
      </div>
      <CalendarBoardColumTimeSlot slots={slots} date={date} />
    </div>
  );
};

export default CalendarBoardColumTime;
