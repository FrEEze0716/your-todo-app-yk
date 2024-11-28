"use client";

import React, { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { Button, Badge, Form, Modal } from "react-bootstrap";
import EditTodo from "./EditTodo";

const TodoItem = ({ todo }) => {
  const { deleteTodo, updateTodo } = useTodos();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditClick = (todo) => {
    setSelectedTodo(todo);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTodo(null);
    setShowEditModal(false);
  };

  const markDone = () => {
    updateTodo(todo.id, { ...todo, isCompleted: !todo.isCompleted });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteTodo(todo.id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <tr>
      <td>
        <Form.Check
          type="checkbox"
          checked={todo.isCompleted}
          onChange={markDone}
          className="m-0"
          id={`todo-completed-${todo.id}`}
          name={`todo-completed-${todo.id}`}
        />
      </td>
      <td className="text-start">
        <span
          style={{
            textDecoration: todo.isCompleted ? "line-through" : "none",
            color: todo.isExpired ? "red" : "white",
          }}
        >
          {todo.description}
          {todo.isExpired && "   (Expired)"}
        </span>
      </td>
      <td>
        <span style={{ whiteSpace: "nowrap" }}>
          {new Date(todo.startDate).toLocaleDateString()}
        </span>
      </td>
      <td>
        <span style={{ whiteSpace: "nowrap" }}>
          {new Date(todo.dueDate).toLocaleDateString()}
        </span>
      </td>
      <td>
        <Badge
          bg={
            todo.category === "Work"
              ? "primary"
              : todo.category === "Personal"
              ? "success"
              : todo.category === "Urgent"
              ? "danger"
              : "secondary"
          }
        >
          {todo.category}
        </Badge>
      </td>
      <td>
        <div className="d-flex">
          <Button
            variant="outline-light"
            size="sm"
            className="m-1"
            onClick={() => handleEditClick(todo)}
          >
            <i className="bi bi-pencil-square"></i>
          </Button>

          <Button
            variant="outline-danger"
            size="sm"
            className="m-1"
            onClick={handleDeleteClick}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </div>

        {selectedTodo && (
          <EditTodo
            todo={selectedTodo}
            show={showEditModal}
            onClose={handleCloseModal}
          />
        )}

        <Modal show={showDeleteModal} onHide={handleCancelDelete}>
          <Modal.Header closeButton closeVariant="white" className="bg-dark">
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark">
            Are you sure you want to delete this todo?
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </td>
    </tr>
  );
};

export default TodoItem;
