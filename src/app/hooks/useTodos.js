"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const updateExpiredStatus = (todos) => {
    const currentDate = new Date();

    console.log("currentDate");
    console.log(currentDate);

    return todos.map((todo) => {
      const dueDate = todo.dueDate;
      console.log(dueDate < currentDate);

      return {
        ...todo,
        isExpired: dueDate < currentDate,
      };
    });
  };

  useEffect(() => {
    // localStorage.clear();

    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const updatedTodos = updateExpiredStatus(savedTodos);

    console.log("updatedTodos");
    console.log(updatedTodos);

    setTodos(updatedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    setTodos((prev) => [...prev, todo]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    setToastMessage("Todo deleted successfully!");
    setShowToast(true);
  };

  const updateTodo = (id, updatedTodo) => {
    setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    setToastMessage("Todo edited successfully!");
    setShowToast(true);
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, deleteTodo, updateTodo }}>
      {children}
      <ToastContainer position="top-end" className="p-3 text-start">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
