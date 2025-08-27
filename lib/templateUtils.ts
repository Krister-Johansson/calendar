import { DateTime } from 'luxon';
import {
  DayPattern,
  TimeSlot,
  TimeSlotTemplate,
  WeekPattern,
} from '../component/CalendarBoard/CalendarBoardColumTimeSlot';

/**
 * Gets the effective start date for a template
 * If startDate is null/undefined, use start of the year
 */
export const getEffectiveStartDate = (template: TimeSlotTemplate): DateTime => {
  if (template.startDate) {
    return DateTime.fromISO(template.startDate);
  }
  // Default to start of current year
  return DateTime.now().startOf('year');
};

/**
 * Gets the effective end date for a template
 * If endDate is null/undefined, use a far future date (no limit)
 */
export const getEffectiveEndDate = (template: TimeSlotTemplate): DateTime => {
  if (template.endDate) {
    return DateTime.fromISO(template.endDate);
  }
  // Default to far future (no end date)
  return DateTime.fromISO('2100-12-31');
};

/**
 * Generates a unique slot instance ID using the pattern: templateId|anchorId|date
 * This matches the user's requirement for slotInstanceId
 */
export const generateSlotInstanceId = (
  templateId: string,
  anchorId: string,
  date: DateTime
): string => {
  // Simple hash function to create a base64-like string
  const combined = `${templateId}|${anchorId}|${date.toISODate()}`;
  return btoa(combined).replace(/[+/=]/g, ''); // Remove base64 special chars
};

/**
 * Resolves overlapping templates by applying creation date rules
 * Newer templates override older ones for the same time period
 */
export const resolveTemplates = (
  templates: TimeSlotTemplate[]
): TimeSlotTemplate[] => {
  // Sort by creation date (newest first)
  const sortedTemplates = [...templates].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const resolvedTemplates: TimeSlotTemplate[] = [];

  for (const template of sortedTemplates) {
    if (!template.active) continue;

    // Check if this template is completely overridden by newer templates
    const isOverridden = resolvedTemplates.some(resolved => {
      if (!resolved.active) return false;

      // Check if the resolved template completely covers this template's time range
      const resolvedStart = resolved.startDate
        ? DateTime.fromISO(resolved.startDate)
        : DateTime.fromISO('1900-01-01');
      const resolvedEnd = resolved.endDate
        ? DateTime.fromISO(resolved.endDate)
        : DateTime.fromISO('2100-01-01');
      const templateStart = template.startDate
        ? DateTime.fromISO(template.startDate)
        : DateTime.fromISO('1900-01-01');
      const templateEnd = template.endDate
        ? DateTime.fromISO(template.endDate)
        : DateTime.fromISO('2100-01-01');

      return resolvedStart <= templateStart && resolvedEnd >= templateEnd;
    });

    if (!isOverridden) {
      resolvedTemplates.push(template);
    }
  }

  return resolvedTemplates;
};

/**
 * Gets the week index for a given date relative to the template's start date
 * Week patterns repeat cyclically: week1, week2, week1, week2, etc.
 */
export const getWeekIndex = (
  date: DateTime,
  templateStartDate: DateTime,
  totalWeeks: number
): number => {
  const weeksDiff = date.diff(templateStartDate, 'weeks').weeks;
  // For 2 week patterns, cycle through 0, 1, 0, 1, etc.
  // For 3 week patterns, cycle through 0, 1, 2, 0, 1, 2, etc.
  const weekIndex = Math.floor(weeksDiff) % totalWeeks; // Cycle through weeks 0, 1, 2...
  return weekIndex; // Return 0-based index for array access
};

/**
 * Gets the day of week (1-7, where 1 is Monday)
 */
export const getDayOfWeek = (date: DateTime): number => {
  return date.weekday;
};

/**
 * Gets the day name (Mon, Tue, Wed, etc.)
 */
export const getDayName = (date: DateTime): string => {
  return date.toFormat('ccc');
};

/**
 * Finds applicable day patterns for a given date
 */
export const findApplicableDayPatterns = (
  date: DateTime,
  weekPattern: WeekPattern
): DayPattern[] => {
  const dayOfWeek = getDayOfWeek(date);
  const dayName = getDayName(date);

  // Find patterns that match this day
  return weekPattern.days.filter(day => {
    if (typeof day.day === 'number') {
      return day.day === dayOfWeek;
    } else {
      return day.day === dayName;
    }
  });
};

/**
 * Generates time slots from templates for a specific date range
 */
export const generateSlotsFromTemplates = (
  templates: TimeSlotTemplate[],
  startDate: DateTime,
  endDate: DateTime
): TimeSlot[] => {
  // Sort by creation date (newest first) and filter active ones
  const activeTemplates = templates
    .filter(t => t.active)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (activeTemplates.length === 0) return [];

  const slots: TimeSlot[] = [];
  let currentDate = startDate.startOf('day');

  while (currentDate <= endDate.endOf('day')) {
    // Find which template applies to this date
    let applicableTemplate: TimeSlotTemplate | null = null;

    for (const template of activeTemplates) {
      const templateStart = template.startDate
        ? DateTime.fromISO(template.startDate)
        : DateTime.now().startOf('year');
      const templateEnd = template.endDate
        ? DateTime.fromISO(template.endDate)
        : DateTime.fromISO('2100-12-31');

      if (currentDate >= templateStart && currentDate <= templateEnd) {
        applicableTemplate = template;
        break; // Use the first (newest) applicable template
      }
    }

    if (!applicableTemplate) {
      currentDate = currentDate.plus({ days: 1 });
      continue;
    }

    // Get the template's start date for week calculation
    const templateStartDate = applicableTemplate.startDate
      ? DateTime.fromISO(applicableTemplate.startDate).startOf('week')
      : DateTime.now().startOf('year').startOf('week');

    // Calculate which week pattern to use (cycles through array positions)
    const weekIndex = getWeekIndex(
      currentDate,
      templateStartDate,
      applicableTemplate.weeks.length
    );

    // Find the week pattern for this week using array position directly
    const weekPattern = applicableTemplate.weeks[weekIndex];
    if (!weekPattern) {
      currentDate = currentDate.plus({ days: 1 });
      continue;
    }

    // Find applicable day patterns for this date
    const dayPatterns = findApplicableDayPatterns(currentDate, weekPattern);

    // Generate slots for each applicable day pattern
    for (const dayPattern of dayPatterns) {
      for (const slotPattern of dayPattern.slots) {
        const [startHour, startMinute] = slotPattern.start
          .split(':')
          .map(Number);
        const endHour = slotPattern.end.split(':').map(Number)[0];
        const endMinute = slotPattern.end.split(':').map(Number)[1];

        const slotStartDate = currentDate.set({
          hour: startHour,
          minute: startMinute,
        });
        const slotEndDate = currentDate.set({
          hour: endHour,
          minute: endMinute,
        });

        // Generate stable anchorId: templateId:date:slotId (base64 encoded)
        const dateString = currentDate.toFormat('yyyy-MM-dd');
        const anchorIdParts = `${applicableTemplate.id}:${dateString}:${slotPattern.id}`;
        const stableAnchorId = btoa(anchorIdParts); // Base64 encode

        slots.push({
          id: stableAnchorId, // Use stable anchorId as the slot ID
          templateId: applicableTemplate.id,
          isBooked: false, // Default to not booked
          startDate: slotStartDate,
          endDate: slotEndDate,
          date: currentDate,
        });
      }
    }

    currentDate = currentDate.plus({ days: 1 });
  }

  return slots;
};

/**
 * Checks if a specific slot is booked
 */
export const isSlotBooked = (
  slotId: string,
  bookedSlotIds: string[]
): boolean => {
  return bookedSlotIds.includes(slotId);
};

/**
 * Creates a template from the JSON structure
 */
export const createTemplateFromJSON = (
  templateData: TimeSlotTemplate
): TimeSlotTemplate => {
  return {
    id: templateData.id,
    name: templateData.name,
    active: templateData.active,
    startDate: templateData.startDate,
    endDate: templateData.endDate,
    createdAt: templateData.createdAt,
    weeks: templateData.weeks,
  };
};

/**
 * Creates a default template for always-available slots
 */
export const createDefaultTemplate = (
  name: string,
  weeks: WeekPattern[]
): TimeSlotTemplate => {
  return {
    id: `default_${Date.now()}`,
    name,
    active: true,
    startDate: undefined, // always active
    endDate: undefined, // always active
    createdAt: new Date().toISOString(),
    weeks,
  };
};

/**
 * Creates a temporary template for specific date ranges
 */
export const createTemporaryTemplate = (
  name: string,
  startDate: string,
  endDate: string,
  weeks: WeekPattern[]
): TimeSlotTemplate => {
  return {
    id: `temp_${Date.now()}`,
    name,
    active: true,
    startDate,
    endDate,
    createdAt: new Date().toISOString(),
    weeks,
  };
};

/**
 * Demonstrates how the stable anchorId system works
 * This function shows how to track bookings even when templates change
 */
export const explainStableAnchorId = (
  anchorId: string
): {
  templateId: string;
  date: string;
  slotId: string;
  pattern: string;
} => {
  try {
    // Decode base64 anchorId: templateId:date:slotId
    const decoded = atob(anchorId);
    const [templateId, date, slotId] = decoded.split(':');

    return {
      templateId,
      date,
      slotId,
      pattern: `Template ${templateId}, Date ${date}, Slot ${slotId}`,
    };
  } catch (error) {
    return {
      templateId: 'Invalid',
      date: 'Invalid',
      slotId: 'Invalid',
      pattern: 'Invalid anchorId format',
    };
  }
};
