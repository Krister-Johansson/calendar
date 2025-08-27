const CalendarBoardFooter = () => {
  return (
    <footer className="flex justify-center gap-4 md:gap-6 md:p-3 bg-gray-50 border-t border-gray-200 text-sm md:text-base">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-green-100 border border-green-200 rounded"></div>
        <span className="text-gray-600">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-100 border border-gray-300 rounded"></div>
        <span className="text-gray-600">Booked</span>
      </div>
    </footer>
  );
};

export default CalendarBoardFooter;
