"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useTodos } from "../hooks/useTodos";
import { Button, Form, Toast, ToastContainer } from "react-bootstrap";

const ImportExport = ({ todos }) => {
  const { addTodo } = useTodos();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(todos);

    XLSX.utils.book_append_sheet(workbook, worksheet, "To-Do List");
    XLSX.writeFile(workbook, "todo-list.xlsx");
  };

  const importFromExcel = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      setToastMessage("Please upload a valid Excel file.");
      setShowToast(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const workbook = XLSX.read(reader.result, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const isValid = data.every(
          (item) =>
            item.hasOwnProperty("id") &&
            item.hasOwnProperty("description") &&
            item.hasOwnProperty("startDate") &&
            item.hasOwnProperty("dueDate") &&
            item.hasOwnProperty("category") &&
            item.hasOwnProperty("isCompleted") &&
            item.hasOwnProperty("isExpired")
        );

        if (!isValid) {
          setToastMessage(
            "Invalid data structure in the file. Please ensure the data includes 'id', 'description', 'startDate', 'dueDate', 'category', 'isCompleted', and 'isExpired'."
          );
          setShowToast(true);
          return;
        }

        const existingTodoIds = todos.map((todo) => todo.id);
        let skipTodos = [];

        const formattedTodos = data
          .map((item, index) => {
            if (existingTodoIds.includes(item.id)) {
              skipTodos.push(`Todo with ID ${item.id} already exists.`);
              return null;
            }

            return {
              id: item.id || Date.now() + index,
              description: item.description || "Untitled Task",
              startDate:
                item.startDate || new Date().toISOString().split("T")[0],
              dueDate: item.dueDate || new Date().toISOString().split("T")[0],
              category: item.category || "None",
              isCompleted: item.isCompleted || false,
              isExpired: item.isExpired || false,
            };
          })
          .filter((todo) => todo !== null);

        formattedTodos.forEach((todo) => addTodo(todo));

        const finalToastMessage = formattedTodos.length
          ? "Todos imported successfully!"
          : "No new todos were imported.";

        const skipToastMessage = skipTodos.length ? skipTodos.join(" ") : "";

        setToastMessage(`${finalToastMessage} ${skipToastMessage}`);
        setShowToast(true);

        fileInput.value = null;
      } catch (error) {
        setToastMessage("An error occurred while processing the file.");
        setShowToast(true);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center">
      <Button
        className="text-nowrap mb-3"
        variant="info"
        onClick={exportToExcel}
      >
        Export To-Do List to Excel File
      </Button>

      <Form.Group
        controlId="formFile"
        className="d-inline-flex mb-3 align-items-center"
      >
        <Form.Label className="text-nowrap mx-3 text-info">
          Import To-Do List from Excel File:
        </Form.Label>
        <Form.Control type="file" onChange={importFromExcel} />
      </Form.Group>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={"danger"}
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ImportExport;
