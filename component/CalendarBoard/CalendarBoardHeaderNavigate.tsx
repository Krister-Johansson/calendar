import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCalendarContext } from '../../contexts/CalendarContext';

const CalendarBoardHeaderNavigate = () => {
  const { goToPreviousWeek, goToToday, goToNextWeek, isCurrentWeek } =
    useCalendarContext();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousWeek}
        disabled={isCurrentWeek()}
      >
        <ChevronLeft />
      </Button>
      <Button variant="outline" size="sm" onClick={goToToday}>
        <Calendar /> Today
      </Button>
      <Button variant="outline" size="sm" onClick={goToNextWeek}>
        <ChevronRight />
      </Button>
    </div>
  );
};

export default CalendarBoardHeaderNavigate;
