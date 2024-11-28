"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Table,
  InputGroup,
  Pagination,
  Spinner,
} from "react-bootstrap";
import TodoItem from "./TodoItem";
import { useTodos } from "../hooks/useTodos";
import AddTodo from "./AddTodo";
import ImportExport from "./ImportExport";

const TodoList = () => {
  const { todos } = useTodos();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [taskPerPage, setTaskPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [todos]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const categoryList = [
    "All",
    "Work",
    "Personal",
    "Urgent",
    "Completed",
    "Incomplete",
    "Expired",
  ];

  const filteredTodos = todos.filter((todo) => {
    const matchTask = todo.description
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      categoryFilter === "All" ||
      todo.category === categoryFilter ||
      (categoryFilter === "Completed" && todo.isCompleted === true) ||
      (categoryFilter === "Incomplete" && todo.isCompleted === false) ||
      (categoryFilter === "Expired" && todo.isExpired === true);

    return matchTask && matchCategory;
  });

  const sortedTodos = filteredTodos.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);

    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalTodos = sortedTodos.length;
  const totalPages = Math.ceil(totalTodos / taskPerPage);
  const startIndex = (currentPage - 1) * taskPerPage;
  const endIndex = startIndex + taskPerPage;
  const pagination = sortedTodos.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTaskPerPage = (e) => {
    setTaskPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-3">
      <div className="d-flex my-3">
        <AddTodo />

        <InputGroup className="mx-3 flex-grow-1">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <Form.Control
            placeholder="Search by task description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            id="search"
          />
        </InputGroup>

        <Form.Select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: "auto", display: "inline-block" }}
          name="categoryFilter"
          id="categoryFilter"
        >
          {categoryList.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Form.Select>
      </div>

      <ImportExport todos={todos} />

      {loading ? (
        <div className="p-3 mb-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : todos.length === 0 ? (
        <p className="text-center mt-3 mb-5">
          Add your task now to get started!
        </p>
      ) : pagination.length === 0 ? (
        <p className="text-center mt-3 mb-5">
          No tasks match your search criteria. Try changing the search keyword
          or adjusting your filters!
        </p>
      ) : (
        <div className="border border-white p-3 mb-3">
          <Table
            responsive
            striped
            bordered
            hover
            variant="dark"
            className="text-center"
          >
            <thead className="align-middle">
              <tr>
                <th>Progress</th>
                <th className="text-start" style={{ width: "100%" }}>
                  Task
                </th>
                <th>Start Date</th>
                <th>
                  <div className="d-flex align-items-center text-nowrap">
                    Due Date
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={toggleSortOrder}
                    >
                      {sortOrder === "asc" ? (
                        <i className="bi bi-arrow-up-square ps-1 link-info"></i>
                      ) : (
                        <i className="bi bi-arrow-down-square ps-1 link-info"></i>
                      )}
                    </Button>
                  </div>
                </th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {pagination.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <div>
          <Form.Label className="m-2" htmlFor="taskPerPage">
            Tasks per page:
          </Form.Label>
          <Form.Select
            value={taskPerPage}
            onChange={handleTaskPerPage}
            style={{ width: "auto", display: "inline-block" }}
            name="taskPerPage"
            id="taskPerPage"
          >
            {[5, 10, 15, 20].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </Form.Select>
        </div>

        <Pagination className="m-2">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <Pagination.Item>{`Page ${currentPage} of ${totalPages}`}</Pagination.Item>
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default TodoList;
