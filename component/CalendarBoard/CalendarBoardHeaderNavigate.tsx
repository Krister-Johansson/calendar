import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCalendarContext } from '../../contexts/CalendarContext';

const CalendarBoardHeaderNavigate = () => {
  const { handlePrevWeek, handleToday, handleNextWeek, isSameWeek } =
    useCalendarContext();
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevWeek}
        className="h-8 w-8 md:h-9 md:w-9 p-0 touch-manipulation"
        disabled={isSameWeek()}
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleToday}
        className="h-8 px-3 md:h-9 md:px-4 bg-transparent touch-manipulation"
      >
        <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-1" />
        <span className="hidden sm:inline text-sm">Today</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextWeek}
        className="h-8 w-8 md:h-9 md:w-9 p-0 touch-manipulation"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </div>
  );
};

export default CalendarBoardHeaderNavigate;
