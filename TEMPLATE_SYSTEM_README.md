# Week-Based Time Slot Template System

This document explains the new week-based template system that allows for dynamic slot generation with overlapping templates and unique slot identification.

## Overview

The template system uses a sophisticated week-based pattern approach that:

- Supports week-based patterns with different week indices (1, 2, 3, 4, 5)
- **Repeats week patterns cyclically** from startDate to endDate (week1, week2, week3, week1, week2, week3, ...)
- Handles day indexing using both numeric (1-7) and named days ("Mon", "Tue", etc.)
- Uses anchor IDs for slot patterns that get combined with dates
- Implements template overlapping where newer templates override older ones
- Generates unique slot instance IDs for booking tracking

## Key Concepts

### 1. TimeSlotTemplate

A template defines when slots should be available:

- `weeks`: Array of week patterns with different indices
- `startDate`: **Start of week** (Monday) - defines when week 1 begins
- `endDate`: **End of week** (Sunday) - defines when the cycle stops
- `createdAt`: ISO datetime string for determining override priority
- `active`: Boolean flag to enable/disable templates

### 2. WeekPattern

Defines patterns for specific weeks that repeat cyclically:

- `index`: Week index (1-5, where 1 is the first week pattern)
- `days`: Array of day patterns for that week

### 3. DayPattern

Defines patterns for specific days:

- `day`: Day identifier (1-7 for Monday-Sunday, or "Mon", "Tue", etc.)
- `slots`: Array of slot patterns for that day

### 4. SlotPattern

Defines individual time slots:

- `anchorId`: Unique identifier for this slot pattern
- `start` / `end`: Time of day (HH:mm format)

### 5. TimeSlot

A generated slot instance:

- `id`: Unique slot instance ID (generated from templateId|anchorId|date)
- `templateId`: Reference to the template that generated it
- `anchorId`: Reference to the slot pattern
- `date`: The specific date this slot represents

## Cyclical Week Pattern System

### How It Works

1. **startDate** defines the beginning of the first week (must be start of week)
2. **endDate** defines the end of the last week (must be end of week)
3. **Week patterns repeat cyclically** until endDate is reached

### Example: 3-Week Pattern

If you have 3 week patterns (index 1, 2, 3):

- **Week 1**: Oct 6-12 (Monday-Sunday) → uses week pattern index 1
- **Week 2**: Oct 13-19 (Monday-Sunday) → uses week pattern index 2
- **Week 3**: Oct 20-26 (Monday-Sunday) → uses week pattern index 3
- **Week 1**: Oct 27-31 (Monday-Sunday) → cycles back to week pattern index 1

### Why startDate and endDate Are Required

- **startDate** tells the system when week 1 begins
- **endDate** tells the system when to stop generating slots
- Without these boundaries, the system wouldn't know which week pattern to use for any given date

## JSON Structure

The system works with JSON templates like this:

```json
{
  "templates": [
    {
      "id": "base-template",
      "name": "Standard Week",
      "active": true,
      "startDate": "2025-01-06", // Monday, start of week
      "endDate": "2025-12-28", // Sunday, end of week
      "createdAt": "2025-01-01T00:00:00Z",
      "weeks": [
        {
          "index": 1, // Week 1 pattern
          "days": [
            {
              "day": 1, // Monday
              "slots": [
                { "anchorId": "morning", "start": "09:00", "end": "12:00" }
              ]
            }
          ]
        },
        {
          "index": 2, // Week 2 pattern
          "days": [
            {
              "day": 2, // Tuesday
              "slots": [
                { "anchorId": "afternoon", "start": "14:00", "end": "17:00" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Slot ID Generation

Each slot gets a unique ID using the pattern:

```typescript
slotInstanceId = hashBase64Url(
  `${template.id}|${slotPattern.anchorId}|${date}`
);
```

This ensures:

- **Uniqueness**: Each slot instance has a unique identifier
- **Traceability**: Easy to track which template and pattern generated the slot
- **Booking Integration**: Simple to check if a slot is booked using the ID

## Template Resolution

Templates are resolved based on:

1. **Creation Date**: Newer templates override older ones for the same time period
2. **Date Range**: Templates only apply to their specified date ranges (week boundaries)
3. **Active Status**: Only active templates are considered

### Example: Template Override

1. **Base Template** (created Jan 1): 3-week pattern for Jan-Dec
2. **Updated Template** (created Sep 15): Special hours for October weeks 1-2
3. **Result**: October weeks 1-2 use updated template, other weeks use base template

## Week and Day Indexing

### Week Index (Cyclical)

- **Week 1**: First week pattern (repeats every 3rd week if you have 3 patterns)
- **Week 2**: Second week pattern (repeats every 3rd week if you have 3 patterns)
- **Week 3**: Third week pattern (repeats every 3rd week if you have 3 patterns)
- **Week 4**: Fourth week pattern (if defined)
- **Week 5**: Fifth week pattern (if defined)

### Day Index

- **Numeric**: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Sunday
- **Named**: "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"

## Usage Examples

### Basic Cyclical Week Pattern

```typescript
const template: TimeSlotTemplate = {
  id: 'base-template',
  name: 'Standard Week',
  active: true,
  startDate: '2025-01-06', // Monday, start of week
  endDate: '2025-12-28', // Sunday, end of week
  createdAt: '2025-01-01T00:00:00Z',
  weeks: [
    {
      index: 1, // First week pattern
      days: [
        {
          day: 1, // Monday
          slots: [
            { anchorId: 'morning', start: '09:00', end: '12:00' },
            { anchorId: 'afternoon', start: '14:00', end: '17:00' },
          ],
        },
      ],
    },
    {
      index: 2, // Second week pattern
      days: [
        {
          day: 2, // Tuesday
          slots: [
            { anchorId: 'special_tuesday', start: '10:00', end: '18:00' },
          ],
        },
      ],
    },
  ],
};
```

### Template Override for Specific Weeks

```typescript
const overrideTemplate: TimeSlotTemplate = {
  id: 'override-template',
  name: 'Special October Hours',
  active: true,
  startDate: '2025-10-06', // Monday, start of week
  endDate: '2025-10-26', // Sunday, end of week
  createdAt: '2025-09-15T10:30:00Z', // Newer than base template
  weeks: [
    {
      index: 1, // First week of October
      days: [
        {
          day: 'Mon', // Monday using day name
          slots: [{ anchorId: 'oct_monday', start: '08:00', end: '10:00' }],
        },
      ],
    },
  ],
};
```

## Database Integration

When you integrate with a database, you'll want to store:

```sql
-- Templates table
CREATE TABLE time_slot_templates (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  start_date DATE NOT NULL, -- Must be start of week
  end_date DATE NOT NULL,   -- Must be end of week
  created_at TIMESTAMP DEFAULT NOW(),
  template_data JSONB -- Store the weeks array as JSON
);

-- Week patterns table (if you want to normalize)
CREATE TABLE week_patterns (
  id VARCHAR PRIMARY KEY,
  template_id VARCHAR REFERENCES time_slot_templates(id),
  week_index INTEGER NOT NULL,
  day_data JSONB -- Store the days array as JSON
);

-- Booked slots table
CREATE TABLE booked_slots (
  id VARCHAR PRIMARY KEY, -- This is the slotInstanceId
  template_id VARCHAR REFERENCES time_slot_templates(id),
  anchor_id VARCHAR NOT NULL,
  slot_date DATE NOT NULL,
  is_booked BOOLEAN DEFAULT TRUE,
  booked_at TIMESTAMP DEFAULT NOW()
);
```

## Benefits

1. **Flexibility**: Week-based patterns allow for complex recurring schedules
2. **Cyclical Repeating**: Week patterns automatically repeat until endDate
3. **Override Support**: Easy to create temporary changes without affecting base templates
4. **Scalability**: Templates can span multiple months and handle complex scenarios
5. **Maintainability**: Centralized template management with clear override logic
6. **Performance**: Slots are generated on-demand for the current view
7. **Booking Integration**: Unique slot IDs make it easy to track bookings

## Future Enhancements

1. **Recurring Patterns**: Monthly, quarterly, yearly patterns
2. **Conditional Templates**: Weather-dependent, demand-based scheduling
3. **Template Inheritance**: Base templates with incremental overrides
4. **Advanced Week Logic**: Custom week definitions (e.g., fiscal weeks)
5. **Template Sharing**: Reusable templates across different services
