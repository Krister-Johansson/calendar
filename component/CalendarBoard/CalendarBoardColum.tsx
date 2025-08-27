import { useMemo } from 'react';
import { useCalendarContext } from '../../contexts/CalendarContext';
import { useCalendarData } from '../../hooks/useCalendarData';
import { generateSlotsFromTemplates } from '../../lib/templateUtils';
import CalendarBoardColumHeader from './CalendarBoardColumHeader';
import CalendarBoardColumTime from './CalendarBoardColumTime';
import { TimeSlotTemplate } from './CalendarBoardColumTimeSlot';

const CalendarBoardColum = () => {
  const { weekDays, startOfEndOfWeek } = useCalendarContext();

  const { templates, isSlotBooked, isLoading } = useCalendarData('user1');
  const slots = useMemo(() => {
    if (isLoading || !templates || templates.length === 0) {
      return [];
    }

    const generatedSlots = generateSlotsFromTemplates(
      templates as TimeSlotTemplate[],
      startOfEndOfWeek.startOfWeek,
      startOfEndOfWeek.endOfWeek
    );

    // Mark slots as booked based on Convex data
    return generatedSlots.map(slot => ({
      ...slot,
      isBooked: isSlotBooked(slot.id),
    }));
  }, [
    templates,
    startOfEndOfWeek.startOfWeek,
    startOfEndOfWeek.endOfWeek,
    isSlotBooked,
    isLoading,
  ]);

  if (isLoading) {
    return (
      <div className="bg-white flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="bg-white flex-1 flex items-center justify-center">
        <div className="text-gray-500">
          No templates found. Create some templates to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 flex flex-col">
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map(date => (
          <CalendarBoardColumHeader key={date.toISODate()} date={date} />
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1">
        {weekDays.map(date => (
          <CalendarBoardColumTime
            key={date.toISODate()}
            date={date}
            slots={slots}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarBoardColum;
