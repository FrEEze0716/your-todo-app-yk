"use client";

import React, { forwardRef, useState } from "react";
import { useTodos } from "../hooks/useTodos";
import DatePicker from "react-datepicker";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  ToastContainer,
  Toast,
} from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";

const AddTodo = () => {
  const { addTodo } = useTodos();
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [category, setCategory] = useState("Work");
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
      addTodo({
        id: Date.now(),
        description,
        startDate,
        dueDate,
        category,
        isCompleted: false,
        isExpired: false,
      });
      setToastMessage("Todo added successfully!");
      setShowToast(true);
      resetForm();
      setShowModal(false);
    }
    setValidated(true);
  };

  const resetForm = () => {
    setDescription("");
    setStartDate(null);
    setDueDate(null);
    setCategory("Work");
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
    <>
      <Button
        className="text-nowrap"
        variant="info"
        onClick={() => setShowModal(true)}
      >
        Add Task
      </Button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton closeVariant="white" className="bg-dark">
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="taskDescription">
                Task Description
              </Form.Label>
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
              Confirm
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
    </>
  );
};

export default AddTodo;
