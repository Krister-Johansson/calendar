import { useMemo } from 'react';
import { useCalendarContext } from '../../contexts/CalendarContext';
import { generateSlotsFromTemplates } from '../../lib/templateUtils';
import CalendarBoardColumHeader from './CalendarBoardColumHeader';
import CalendarBoardColumTime from './CalendarBoardColumTime';
import { TimeSlotTemplate } from './CalendarBoardColumTimeSlot';

// Example templates matching your JSON structure
const exampleTemplates: TimeSlotTemplate[] = [
  // Base template for September-December
  {
    id: '771c6e9d-8676-423f-bc8c-55c893f324cc',
    name: 'Base Week',
    active: true,
    startDate: null,
    endDate: null,
    createdAt: '2025-08-20T09:00:00Z',
    weeks: [
      {
        days: [
          {
            day: 1, // Monday
            slots: [
              {
                id: '171c6e9d-8676-423f-bc8c-55c893f324cc',
                start: '09:00',
                end: '12:00',
              },
              {
                id: '271c6e9d-8676-423f-bc8c-55c893f324cc',
                start: '14:00',
                end: '17:00',
              },
            ],
          },
          {
            day: 2, // Tuesday
            slots: [
              {
                id: '371c6e9d-8676-423f-bc8c-55c893f324cc',
                start: '10:00',
                end: '15:00',
              },
            ],
          },
          {
            day: 3, // Wednesday
            slots: [
              {
                id: '471c6e9d-8676-423f-bc8c-55c893f324cc',
                start: '10:00',
                end: '16:00',
              },
            ],
          },
          {
            day: 4, // Thursday
            slots: [
              {
                id: '571c6e9d-8676-423f-bc8c-55c893f324cc',
                start: '11:00',
                end: '16:00',
              },
            ],
          },
          {
            day: 5, // Friday
            slots: [
              {
                id: '671c6e9d-8676-423f-bc8c-55c893f324cc',
                start: '09:00',
                end: '14:00',
              },
              {
                id: '771c6e9d-8676-423f-bc8c-55c893f324cc',
                start: '15:00',
                end: '19:00',
              },
            ],
          },
        ],
      },
      {
        days: [
          {
            day: 1, // Monday of week 2
            slots: [
              {
                id: '871c6e9d-8676-423f-bc8c-55c893f324cc',
                start: '08:00',
                end: '13:00',
              },
            ],
          },
          {
            day: 6, // Wednesday of week 2
            slots: [
              {
                id: '971c6e9d-8676-423f-bc8c-55c893f324cc',
                start: '14:00',
                end: '20:00',
              },
            ],
          },
        ],
      },
    ],
  },

  // Updated template for October (overrides base template)
  {
    id: '771c6e9d-8676-423f-bc8c-55c893f324c2',
    name: 'Updated Mondays',
    active: true,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    createdAt: '2025-09-15T10:30:00Z',
    weeks: [
      {
        days: [
          {
            day: 3, // Monday (using day name)
            slots: [
              { id: '101', start: '08:00', end: '09:00' },
              { id: '102', start: '09:00', end: '10:00' },
              { id: '103', start: '10:00', end: '11:00' },
            ],
          },
        ],
      },
      {
        days: [
          {
            day: 3, // Monday of second week
            slots: [{ id: '201', start: '07:00', end: '12:00' }],
          },
        ],
      },
    ],
  },
];

const CalendarBoardColum = () => {
  const { weekDays, isBeforeToday, isToday, startOfEndOfWeek } =
    useCalendarContext();

  // Test data: Array of booked slot IDs
  const bookedSlotIds = useMemo(
    () => [
      // Book some Monday morning slots for testing
      'NzcxYzZlOWQtODY3Ni00MjNmLWJjOGMtNTVjODkzZjMyNGNjOjIwMjUtMDgtMjc6NDcxYzZlOWQtODY3Ni00MjNmLWJjOGMtNTVjODkzZjMyNGNj', // Monday 9:00-12:00
      'NzcxYzZlOWQtODY3Ni00MjNmLWJjOGMtNTVjODkzZjMyNGNjOjIwMjUtMDgtMjk6NzcxYzZlOWQtODY3Ni00MjNmLWJjOGMtNTVjODkzZjMyNGNj', // Tuesday 10:00-15:00
    ],
    []
  );

  // Generate slots from templates for the current week
  const slots = useMemo(() => {
    const generatedSlots = generateSlotsFromTemplates(
      exampleTemplates,
      startOfEndOfWeek.startOfWeek,
      startOfEndOfWeek.endOfWeek
    );

    // Mark slots as booked based on bookedSlotIds
    return generatedSlots.map(slot => ({
      ...slot,
      isBooked: bookedSlotIds.includes(slot.id),
    }));
  }, [startOfEndOfWeek.startOfWeek, startOfEndOfWeek.endOfWeek, bookedSlotIds]);

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
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarBoardColum;
