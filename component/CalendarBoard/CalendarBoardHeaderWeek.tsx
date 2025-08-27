import { useMemo } from 'react';
import { useCalendarContext } from '../../contexts/CalendarContext';

const CalendarBoardHeaderWeek = () => {
  const { weekNumber, startOfEndOfWeek } = useCalendarContext();
  const { startOfWeek: start, endOfWeek: end } = startOfEndOfWeek;

  const { labelMd, labelSm } = useMemo(() => {
    const sameMonth = start.month === end.month && start.year === end.year;

    if (sameMonth) {
      return {
        labelMd: start.toFormat('MMMM yyyy'),
        labelSm: start.toFormat('MMM yy'),
      };
    }

    // Week spans months (possibly years)
    return {
      // Desktop: Full month names, year on the ending month
      labelMd: `${start.toFormat('MMMM')} / ${end.toFormat('MMMM yyyy')}`,
      // Mobile: Short month names, year on the ending month (two digits)
      labelSm: `${start.toFormat('MMM')} / ${end.toFormat('MMM yy')}`,
    };
  }, [start, end]);

  return (
    <div className="text-sm md:text-base text-gray-600 font-medium flex items-center gap-1">
      {/* Week number */}
      <span className="text-gray-800 font-bold hidden md:inline">
        Week: {weekNumber}
      </span>
      <span className="text-gray-800 font-bold md:hidden">
        Week {weekNumber}
      </span>

      {/* Date range label */}
      <span className="hidden md:inline">{labelMd}</span>
      <span className="md:hidden">{labelSm}</span>
    </div>
  );
};

export default CalendarBoardHeaderWeek;
