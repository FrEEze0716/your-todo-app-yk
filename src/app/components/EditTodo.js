"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { useTodos } from "../hooks/useTodos";
import DatePicker from "react-datepicker";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";

const EditTodo = ({ todo, show, onClose }) => {
  const { updateTodo } = useTodos();
  const [description, setDescription] = useState(todo?.description || "");
  const [startDate, setStartDate] = useState(todo?.startDate || null);
  const [dueDate, setDueDate] = useState(todo?.dueDate || null);
  const [category, setCategory] = useState(todo?.category || "Work");
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setDescription(todo?.description || "");
    setStartDate(todo?.startDate || null);
    setDueDate(todo?.dueDate || null);
    setCategory(todo?.category || "Work");
  }, [todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (
      form.checkValidity() === false ||
      startDate > dueDate ||
      dueDate < startDate
    ) {
      e.stopPropagation();
    } else {
      updateTodo(todo.id, {
        ...todo,
        description,
        startDate,
        dueDate,
        category,
      });
      onClose();
    }

    setValidated(true);
  };

  const CustomStartDate = forwardRef(({ value, onClick, onChange }, ref) => (
    <>
      <Form.Control
        type="text"
        value={value}
        onClick={onClick}
        onChange={onChange}
        ref={ref}
        placeholder="YYYY-MM-DD"
        required
        name="startDate"
        id="startDate"
        isInvalid={startDate > dueDate}
      />
      <Form.Control.Feedback type="invalid">
        Please select valid start date for the task.
      </Form.Control.Feedback>
    </>
  ));

  const CustomDueDate = forwardRef(({ value, onClick, onChange }, ref) => (
    <>
      <Form.Control
        type="text"
        value={value}
        onClick={onClick}
        onChange={onChange}
        ref={ref}
        placeholder={!startDate ? "Select start date first" : "YYYY-MM-DD"}
        required
        name="dueDate"
        id="dueDate"
        disabled={!startDate}
        isInvalid={dueDate < startDate}
      />
      <Form.Control.Feedback type="invalid">
        Please select valid due date for the task.
      </Form.Control.Feedback>
    </>
  ));

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton closeVariant="white" className="bg-dark">
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="taskDescription">Task Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              placeholder="Enter task description here"
              onChange={(e) => setDescription(e.target.value)}
              required
              name="taskDescription"
              id="taskDescription"
            />
            <Form.Control.Feedback type="invalid">
              Please enter task description.
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="startDate">Start Date</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  customInput={<CustomStartDate />}
                  minDate={new Date()}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="dueDate">Due Date</Form.Label>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  dateFormat="yyyy-MM-dd"
                  customInput={<CustomDueDate />}
                  minDate={startDate || new Date()}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="category">Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              name="category"
              id="category"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Urgent">Urgent</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditTodo;
