import React, { useState } from "react";
import { Todo } from "../types";

interface CalendarProps {
  todos: Todo[];
  onDateSelect?: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ todos, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTodosForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return todos.filter((todo) => todo.due_date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (onDateSelect) {
      onDateSelect(dateStr);
    }
  };

  const renderDays = () => {
    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const todosForDay = getTodosForDate(day);
      const hasItems = todosForDay.length > 0;

      days.push(
        <div
          key={day}
          className={`calendar-day ${hasItems ? "has-todos" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasItems && <span className="todo-count">{todosForDay.length}</span>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h3>{monthNames[month]} {year}</h3>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
