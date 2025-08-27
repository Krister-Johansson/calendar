import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

export const useCalendarData = (userId: string = 'user1') => {
  const templates = useQuery(api.calendar.getAllTemplates);
  const bookings = useQuery(api.calendar.getAllBookings);

  const bookSlot = useMutation(api.calendar.bookSlot);
  const cancelBooking = useMutation(api.calendar.cancelBooking);

  const isSlotBooked = (slotId: string) => {
    return bookings?.some(booking => booking.slotId === slotId) ?? false;
  };

  const handleBookSlot = async (
    templateId: string,
    slotId: string,
    date: string
  ) => {
    try {
      await bookSlot({
        templateId: templateId as Id<'templates'>,
        slotId,
        date,
        userId,
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to book slot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const handleCancelBooking = async (slotId: string) => {
    try {
      await cancelBooking({ slotId, userId });
      return { success: true };
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  return {
    templates: templates ?? [],
    bookings: bookings ?? [],
    isSlotBooked,
    bookSlot: handleBookSlot,
    cancelBooking: handleCancelBooking,
    isLoading: templates === undefined || bookings === undefined,
  };
};
