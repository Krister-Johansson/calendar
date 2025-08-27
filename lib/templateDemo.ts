import { DateTime } from 'luxon';
import { TimeSlotTemplate } from '../component/CalendarBoard/CalendarBoardColumTimeSlot';
import {
  generateSlotsFromTemplates,
  createTemplateFromJSON,
  generateSlotInstanceId,
  getEffectiveStartDate,
  getEffectiveEndDate,
} from './templateUtils';

/**
 * Demo: Flexible date handling with null/undefined startDate and endDate
 *
 * This demonstrates:
 * 1. startDate = null/undefined → starts from beginning of year
 * 2. endDate = null/undefined → no end date (continues indefinitely)
 * 3. Week patterns still cycle correctly from the effective start date
 */

// Example templates showing different date configurations
const exampleTemplates: TimeSlotTemplate[] = [
  // Template 1: No start date (starts from beginning of year), no end date
  {
    id: 'always-active-template',
    name: 'Always Active Template',
    active: true,
    startDate: null, // Will start from beginning of year
    endDate: null, // Will continue indefinitely
    createdAt: '2025-01-01T00:00:00Z',
    weeks: [
      {
        index: 1, // Week 1 pattern
        days: [
          {
            day: 1, // Monday
            slots: [
              {
                anchorId: 'week1_monday_morning',
                start: '09:00',
                end: '12:00',
              },
            ],
          },
        ],
      },
      {
        index: 2, // Week 2 pattern
        days: [
          {
            day: 2, // Tuesday
            slots: [
              { anchorId: 'week2_tuesday', start: '14:00', end: '18:00' },
            ],
          },
        ],
      },
    ],
  },

  // Template 2: Specific start date, no end date
  {
    id: 'from-september-template',
    name: 'From September Template',
    active: true,
    startDate: '2025-09-01', // Starts from September 1
    endDate: null, // Continues indefinitely
    createdAt: '2025-08-01T00:00:00Z',
    weeks: [
      {
        index: 1,
        days: [
          {
            day: 3, // Wednesday
            slots: [
              { anchorId: 'sept_wednesday', start: '10:00', end: '16:00' },
            ],
          },
        ],
      },
      {
        index: 2,
        days: [
          {
            day: 5, // Friday
            slots: [{ anchorId: 'sept_friday', start: '13:00', end: '19:00' }],
          },
        ],
      },
    ],
  },
];

// Test the effective date functions
console.log('=== Effective Date Calculation ===');
exampleTemplates.forEach((template, index) => {
  console.log(`\nTemplate ${index + 1}: ${template.name}`);
  console.log(`startDate: ${template.startDate || 'null/undefined'}`);
  console.log(`endDate: ${template.endDate || 'null/undefined'}`);

  const effectiveStart = getEffectiveStartDate(template);
  const effectiveEnd = getEffectiveEndDate(template);

  console.log(`Effective start: ${effectiveStart.toISODate()}`);
  console.log(`Effective end: ${effectiveEnd.toISODate()}`);
});

// Generate slots for different date ranges to see the behavior
const testRanges = [
  { name: 'January', start: '2025-01-01', end: '2025-01-07' },
  { name: 'September', start: '2025-09-01', end: '2025-09-07' },
  { name: 'December', start: '2025-12-25', end: '2025-12-31' },
];

console.log('\n=== Slot Generation Test ===');
testRanges.forEach(range => {
  console.log(`\n--- ${range.name} ---`);

  exampleTemplates.forEach((template, templateIndex) => {
    if (!template.active) return;

    const slots = generateSlotsFromTemplates(
      [template], // Test each template individually
      DateTime.fromISO(range.start),
      DateTime.fromISO(range.end)
    );

    console.log(`Template ${templateIndex + 1}: ${slots.length} slots`);

    // Show first few slots
    slots.slice(0, 3).forEach(slot => {
      console.log(
        `  - ${slot.date.toFormat('ccc')} ${slot.startDate.toFormat('HH:mm')}-${slot.endDate.toFormat('HH:mm')} (${slot.anchorId})`
      );
    });

    if (slots.length > 3) {
      console.log(`  ... and ${slots.length - 3} more slots`);
    }
  });
});

export { exampleTemplates };
