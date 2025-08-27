import { cn } from '@/lib/utils';
import { DateTime } from 'luxon';

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

  // Add a small gap between slots by reducing height slightly
  const gapPercent = 0.5; // 0.5% gap between slots
  const adjustedHeightPercent = Math.max(0, heightPercent - gapPercent);

  return {
    position: 'absolute' as const,
    top: `${topPercent}%`,
    height: `${adjustedHeightPercent}%`,
    left: '4px',
    right: '4px',
    marginBottom: `${gapPercent}%`,
  };
};

interface CalendarBoardColumTimeSlotProps {
  date: DateTime;
  slots: TimeSlot[];
  isDisabled: boolean;
}

const CalendarBoardColumTimeSlot = ({
  date,
  slots,
  isDisabled,
}: CalendarBoardColumTimeSlotProps) => {
  const filteredSlots = slots.filter(slot => {
    return slot.date.hasSame(date, 'day');
  });

  const handleSlotClick = (slot: TimeSlot) => {
    if (isDisabled) return;

    // The anchorId is now base64 encoded: templateId:date:slotId
    // Format: {templateId}:{yyyy-MM-dd}:{slotId} -> base64 encoded
    // Example: 771c6e9d-8676-423f-bc8c-55c893f324cc:2025-01-06:171c6e9d-8676-423f-bc8c-55c893f324cc

    console.log('Slot clicked!', {
      slotId: slot.id, // This is the stable anchorId
      templateId: slot.templateId,
      date: slot.date.toFormat('yyyy-MM-dd'),
      time: `${slot.startDate.toFormat('HH:mm')} - ${slot.endDate.toFormat('HH:mm')}`,
      isBooked: slot.isBooked,
      explanation:
        'slotId is the stable anchorId - use this for booking tracking',
      decodedAnchorId: atob(slot.id), // Show the decoded format
    });
  };

  return filteredSlots.map(slot => (
    <div
      key={slot.id}
      style={getSlotStyle(slot)}
      onClick={() => handleSlotClick(slot)}
      className={cn(
        'p-2 md:p-3 border text-sm  transition-all duration-200 flex flex-col justify-center overflow-hidden rounded ',
        slot.isBooked
          ? 'bg-gray-100 border-gray-300'
          : 'bg-green-100 border-green-200' +
              (isDisabled ? ' cursor-not-allowed' : ' cursor-pointer') +
              ' touch-manipulation active:scale-95'
      )}
    >
      <div className="text-xs md:text-sm mt-1 opacity-75 hidden sm:block text-center">
        <span className="ml-1">
          {slot.startDate.toFormat('HH:mm')} - {slot.endDate.toFormat('HH:mm')}
        </span>
      </div>
    </div>
  ));
};

export default CalendarBoardColumTimeSlot;
