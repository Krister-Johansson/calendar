import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  templates: defineTable({
    roomId: v.id('rooms'),
    name: v.string(),
    active: v.boolean(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  }),

  weeks: defineTable({
    templateId: v.id('templates'),
    index: v.number(),
  }),

  timeSlots: defineTable({
    weekId: v.id('weeks'),
    dayOfWeek: v.number(), // 1=Monday, 2=Tuesday, etc.
    startTime: v.string(), // HH:mm format
    endTime: v.string(), // HH:mm format
  }),

  // Bookings table - stores booked slots
  bookings: defineTable({
    templateId: v.id('templates'),
    slotId: v.string(),
    date: v.string(),
    userId: v.string(),
    bookedAt: v.string(),
  }),
  rooms: defineTable({
    name: v.string(),
    description: v.string(),
  }),
});
