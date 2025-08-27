import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Query: Fetch all active templates with their weeks and time slots
export const getTemplates = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query('templates')
      .filter(q => q.eq(q.field('active'), true))
      .collect();

    const templatesWithData = await Promise.all(
      templates.map(async template => {
        // Get weeks for this template
        const weeks = await ctx.db
          .query('weeks')
          .filter(q => q.eq(q.field('templateId'), template._id))
          .collect();

        // Get time slots for each week
        const weeksWithSlots = await Promise.all(
          weeks.map(async week => {
            const timeSlots = await ctx.db
              .query('timeSlots')
              .filter(q => q.eq(q.field('weekId'), week._id))
              .collect();

            return {
              ...week,
              days: timeSlots.reduce(
                (acc, slot) => {
                  const dayKey = slot.dayOfWeek;
                  if (!acc[dayKey]) {
                    acc[dayKey] = [];
                  }
                  acc[dayKey].push({
                    id: slot._id,
                    start: slot.startTime,
                    end: slot.endTime,
                  });
                  return acc;
                },
                {} as Record<
                  number,
                  Array<{ id: string; start: string; end: string }>
                >
              ),
            };
          })
        );

        return {
          ...template,
          weeks: weeksWithSlots.map(week => ({
            index: week.index,
            days: Object.entries(week.days).map(([day, slots]) => ({
              day: parseInt(day),
              slots: slots,
            })),
          })),
        };
      })
    );

    return templatesWithData;
  },
});

// Query: Fetch all bookings for a user
export const getBookings = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query('bookings')
      .filter(q => q.eq(q.field('userId'), args.userId))
      .collect();

    return bookings.map(booking => ({
      id: booking._id,
      templateId: booking.templateId,
      slotId: booking.slotId,
      date: booking.date,
      userId: booking.userId,
      bookedAt: booking.bookedAt,
    }));
  },
});

// Mutation: Book a slot
export const bookSlot = mutation({
  args: {
    templateId: v.id('templates'),
    slotId: v.string(),
    date: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if slot is already booked
    const existingBooking = await ctx.db
      .query('bookings')
      .filter(q => q.eq(q.field('slotId'), args.slotId))
      .filter(q => q.eq(q.field('userId'), args.userId))
      .first();

    if (existingBooking) {
      throw new Error('Slot is already booked');
    }

    // Create the booking
    const bookingId = await ctx.db.insert('bookings', {
      templateId: args.templateId,
      slotId: args.slotId,
      date: args.date,
      userId: args.userId,
      bookedAt: new Date().toISOString(),
    });

    return bookingId;
  },
});

// Mutation: Cancel a booking
export const cancelBooking = mutation({
  args: {
    slotId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db
      .query('bookings')
      .filter(q => q.eq(q.field('slotId'), args.slotId))
      .filter(q => q.eq(q.field('userId'), args.userId))
      .first();

    if (!booking) {
      throw new Error('Booking not found');
    }

    await ctx.db.delete(booking._id);
    return { success: true };
  },
});

// Query: Fetch all active templates (no userId filter)
export const getAllTemplates = query({
  args: {},
  handler: async ctx => {
    const templates = await ctx.db
      .query('templates')
      .filter(q => q.eq(q.field('active'), true))
      .collect();

    const templatesWithData = await Promise.all(
      templates.map(async template => {
        // Get weeks for this template
        const weeks = await ctx.db
          .query('weeks')
          .filter(q => q.eq(q.field('templateId'), template._id))
          .collect();

        // Get time slots for each week
        const weeksWithSlots = await Promise.all(
          weeks.map(async week => {
            const timeSlots = await ctx.db
              .query('timeSlots')
              .filter(q => q.eq(q.field('weekId'), week._id))
              .collect();

            return {
              index: week.index,
              days: timeSlots.reduce(
                (acc, slot) => {
                  const dayKey = slot.dayOfWeek;
                  if (!acc[dayKey]) {
                    acc[dayKey] = [];
                  }
                  acc[dayKey].push({
                    id: slot._id,
                    start: slot.startTime,
                    end: slot.endTime,
                  });
                  return acc;
                },
                {} as Record<
                  number,
                  Array<{ id: string; start: string; end: string }>
                >
              ),
            };
          })
        );

        return {
          id: template._id, // Map Convex _id to id
          name: template.name,
          active: template.active,
          startDate: template.startDate,
          endDate: template.endDate,
          createdAt: new Date(template._creationTime).toISOString(), // Use _creationTime
          weeks: weeksWithSlots.map(week => ({
            index: week.index,
            days: Object.entries(week.days).map(([day, slots]) => ({
              day: parseInt(day),
              slots: slots,
            })),
          })),
        };
      })
    );

    return templatesWithData;
  },
});

// Query: Fetch all bookings (no userId filter)
export const getAllBookings = query({
  args: {},
  handler: async ctx => {
    const bookings = await ctx.db.query('bookings').collect();

    return bookings.map(booking => ({
      id: booking._id,
      templateId: booking.templateId,
      slotId: booking.slotId,
      date: booking.date,
      userId: booking.userId,
      bookedAt: booking.bookedAt,
    }));
  },
});
