import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const seedDatabase = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Create a base template
    const templateId = await ctx.db.insert('templates', {
      name: 'Base Week',
      active: true,
      startDate: null, // Start of year
      endDate: null, // No end date
      createdAt: new Date().toISOString(),
      userId: args.userId,
    });

    // Create week 1
    const week1Id = await ctx.db.insert('weeks', {
      templateId,
      index: 1,
      userId: args.userId,
    });

    // Create week 2
    const week2Id = await ctx.db.insert('weeks', {
      templateId,
      index: 2,
      userId: args.userId,
    });

    // Add time slots for week 1
    await ctx.db.insert('timeSlots', {
      weekId: week1Id,
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '12:00',
      userId: args.userId,
    });

    await ctx.db.insert('timeSlots', {
      weekId: week1Id,
      dayOfWeek: 1, // Monday
      startTime: '14:00',
      endTime: '17:00',
      userId: args.userId,
    });

    await ctx.db.insert('timeSlots', {
      weekId: week1Id,
      dayOfWeek: 2, // Tuesday
      startTime: '10:00',
      endTime: '15:00',
      userId: args.userId,
    });

    await ctx.db.insert('timeSlots', {
      weekId: week1Id,
      dayOfWeek: 3, // Wednesday
      startTime: '10:00',
      endTime: '16:00',
      userId: args.userId,
    });

    // Add time slots for week 2
    await ctx.db.insert('timeSlots', {
      weekId: week2Id,
      dayOfWeek: 1, // Monday
      startTime: '08:00',
      endTime: '13:00',
      userId: args.userId,
    });

    await ctx.db.insert('timeSlots', {
      weekId: week2Id,
      dayOfWeek: 3, // Wednesday
      startTime: '14:00',
      endTime: '20:00',
      userId: args.userId,
    });

    return { success: true, templateId };
  },
});
