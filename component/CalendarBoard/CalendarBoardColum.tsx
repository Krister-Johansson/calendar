import { useMemo } from 'react';
import { useCalendarContext } from '../../contexts/CalendarContext';
import { generateSlotsFromTemplates } from '../../lib/templateUtils';
import { useCalendarData } from '../../hooks/useCalendarData';
import CalendarBoardColumHeader from './CalendarBoardColumHeader';
import CalendarBoardColumTime from './CalendarBoardColumTime';
import { TimeSlotTemplate, TimeSlot } from './CalendarBoardColumTimeSlot';

const CalendarBoardColum = () => {
  const { weekDays, isBeforeToday, isToday, startOfEndOfWeek } =
    useCalendarContext();

  const { templates, isSlotBooked, bookSlot, isLoading } =
    useCalendarData('user1');
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

  // Handle slot clicks for booking
  const handleSlotClick = async (slot: TimeSlot) => {
    if (slot.isBooked) {
      // Slot is already booked - could implement cancellation here
      console.log('Slot is already booked:', slot.id);
      return;
    }

    try {
      const result = await bookSlot(
        slot.templateId,
        slot.id,
        slot.date.toFormat('yyyy-MM-dd')
      );

      if (result.success) {
        console.log('Slot booked successfully!');
        // The UI will automatically update due to Convex reactivity
      } else {
        console.error('Failed to book slot:', result.error);
      }
    } catch (error) {
      console.error('Error booking slot:', error);
    }
  };

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
    <div className="bg-white flex-1 flex flex-col overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map(d => (
          <CalendarBoardColumHeader
            key={d.toISODate()}
            date={d}
            isToday={isToday(d)}
            isDisabled={isBeforeToday(d)}
          />
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1 min-h-[400px] md:min-h-[500px]">
        {weekDays.map(d => (
          <CalendarBoardColumTime
            key={d.toISODate()}
            date={d}
            slots={slots}
            isToday={isToday(d)}
            isDisabled={isBeforeToday(d)}
            onSlotClick={handleSlotClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarBoardColum;
