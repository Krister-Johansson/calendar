import { cn } from '@/lib/utils';
import { DateTime } from 'luxon';
import { useCalendarContext } from '../../contexts/CalendarContext';
import { useCalendarData } from '../../hooks/useCalendarData';

export type SlotPattern = {
  id: string; // Unique identifier for this slot pattern
  start: string; // HH:mm format
  end: string; // HH:mm format
};

export type DayPattern = {
  day: number | string; // 1, 2, 3... or "Mon", "Tue", etc.
  slots: SlotPattern[];
};

export type WeekPattern = {
  days: DayPattern[];
};

export type TimeSlotTemplate = {
  id: string;
  name: string;
  active: boolean;
  startDate?: string | null; // ISO date string, null/undefined = start of year
  endDate?: string | null; // ISO date string, null/undefined = no end date
  createdAt: string; // ISO datetime string
  weeks: WeekPattern[];
};

export type TimeSlot = {
  id: string; // Stable anchorId (base64 encoded: templateId:date:slotId)
  templateId: string; // Reference to the template that generated this slot
  isBooked: boolean;
  startDate: DateTime;
  endDate: DateTime;
  date: DateTime; // The specific date this slot represents
};

const getSlotStyle = (slot: TimeSlot) => {
  const totalMinutesInDay = 24 * 60;

  const startMinutesFromMidnight =
    slot.startDate.hour * 60 + slot.startDate.minute;
  const endMinutesFromMidnight = slot.endDate.hour * 60 + slot.endDate.minute;

  const topPercent = (startMinutesFromMidnight / totalMinutesInDay) * 100;
  const heightPercent =
    ((endMinutesFromMidnight - startMinutesFromMidnight) / totalMinutesInDay) *
    100;

  return {
    position: 'absolute' as const,
    top: `${topPercent}%`,
    height: `${heightPercent}%`,
    left: '4px',
    right: '4px',
  };
};

interface CalendarBoardColumTimeSlotProps {
  date: DateTime;
  slots: TimeSlot[];
}

const CalendarBoardColumTimeSlot = ({
  date,
  slots,
}: CalendarBoardColumTimeSlotProps) => {
  const { bookSlot } = useCalendarData('user1');
  const { isSlotPassed, isBeforeToday } = useCalendarContext();
  const filteredSlots = slots.filter(slot => {
    return slot.date.hasSame(date, 'day');
  });

  const handleSlotClick = async (slot: TimeSlot) => {
    if (isBeforeToday(date) || isSlotPassed(slot)) return;

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

  return filteredSlots.map(slot => (
    <div
      key={slot.id}
      style={getSlotStyle(slot)}
      onClick={() => handleSlotClick(slot)}
      className={cn(
        'border text-sm transition-all duration-200 flex flex-col justify-center rounded',
        slot.isBooked
          ? 'bg-gray-100 border-gray-300 text-gray-500 pointer-events-none'
          : 'bg-green-100 border-green-200 ' +
              (isBeforeToday(slot.startDate)
                ? ' cursor-not-allowed bg-red-100 text-gray-100'
                : isSlotPassed(slot)
                  ? ' cursor-not-allowed bg-red-100 text-gray-100'
                  : ' cursor-pointer hover:bg-green-200 touch-manipulation active:scale-95')
      )}
    >
      <div className="text-xs md:text-sm text-center md:font-bold text-gray-600">
        <span className="block sm:inline">
          {slot.startDate.toFormat('HH:mm')}
        </span>
        <span className="hidden md:inline">-</span>
        <span className="block sm:inline">
          {slot.endDate.toFormat('HH:mm')}
        </span>
      </div>
    </div>
  ));
};

export default CalendarBoardColumTimeSlot;
