"use client";

import React, { useCallback, useEffect, useState } from "react";
// When using `Day.js`
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import dayjs from "dayjs";
// and, for optional time zone support
import timezone from "dayjs/plugin/timezone";
import { useTodos } from "../hooks/useTodos";

dayjs.extend(timezone);
// end optional time zone support

const localizer = dayjsLocalizer(dayjs);
const DnDCalendar = withDragAndDrop(Calendar);

const CalenderTodo = () => {
  const { todos, updateTodo } = useTodos();
  const [todoList, setTodoList] = useState([]);
  const [updatedEvent, setUpdatedEvent] = useState(null);

  useEffect(() => {
    const updatedList = todos.map(
      ({ description, startDate, dueDate, ...todo }) => {
        const title = description;
        const start = new Date(startDate);
        let end = new Date(dueDate);
        end = dayjs(end).add(1, "day").toDate();

        return {
          ...todo,
          title,
          start,
          end,
          allDay: true,
        };
      }
    );
    setTodoList(updatedList);
  }, [todos]);

  useEffect(() => {
    if (updatedEvent) {
      const { id, title, start, end, category, isCompleted, isExpired } =
        updatedEvent;
      const newEnd = dayjs(end).subtract(1, "day").toDate();

      updateTodo(id, {
        id: id,
        description: title,
        startDate: start,
        dueDate: newEnd,
        category,
        isCompleted,
        isExpired,
      });

      setUpdatedEvent(null);
    }
  }, [updatedEvent, updateTodo]);

  const eventStyleGetter = useCallback((event) => {
    const eventClass =
      event.category === "Work"
        ? "bg-primary"
        : event.category === "Personal"
        ? "bg-success"
        : event.category === "Urgent"
        ? "bg-danger"
        : "bg-secondary";

    const eventStatus = event.isCompleted ? "text-decoration-line-through" : "";
    const eventExpired = event.isExpired ? "text-dark" : "text-white";

    return {
      className: `${eventClass} ${eventStatus} ${eventExpired} rounded p-1`,
    };
  });

  const dayPropGetter = useCallback((date) => {
    const today = dayjs().startOf("day");
    const currentDate = dayjs(date).startOf("day");

    if (today.isSame(currentDate, "day")) {
      return { className: "bg-secondary" };
    }

    return {};
  });

  const moveNResize = useCallback(({ event, start, end }) => {
    setTodoList((prev) =>
      prev.map((ev) =>
        ev.id === event.id ? { ...ev, start, end, allDay: true } : ev
      )
    );

    setUpdatedEvent({
      id: event.id,
      title: event.title,
      start: start,
      end: end,
      category: event.category,
      isCompleted: event.isCompleted,
      isExpired: event.isExpired,
    });
  }, []);

  return (
    <div className="p-3 vh-100">
      <DnDCalendar
        localizer={localizer}
        events={todoList}
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="allDay"
        views={{ month: true, agenda: true }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        onEventDrop={moveNResize}
        onEventResize={moveNResize}
        showAllEvents
        resizable
        draggableAccessor={(event) => true}
      />
    </div>
  );
};

export default CalenderTodo;
