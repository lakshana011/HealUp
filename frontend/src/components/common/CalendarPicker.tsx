import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarPickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const CalendarPicker = ({ selectedDate, onSelectDate }: CalendarPickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (day: number) => {
    if (isPast(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelectDate(date);
  };

  return (
    <div className="card-elevated p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h3 className="font-semibold text-foreground">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first day of month */}
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Day cells */}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isPast(day)}
              className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                isSelected(day)
                  ? 'bg-primary text-primary-foreground'
                  : isToday(day)
                  ? 'bg-primary/10 text-primary'
                  : isPast(day)
                  ? 'text-muted-foreground/50 cursor-not-allowed'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPicker;
