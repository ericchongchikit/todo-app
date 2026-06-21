"use client";

import { useState, useEffect, useCallback } from "react";
import {
  List,
  Calendar,
  Download,
  Upload,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddTodo from "@/src/components/AddTodo";
import ImportTodo from "@/src/components/ImportTodo";
import TodoList from "@/src/components/TodoList";
import { Todo } from "@/src/types";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest");

  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleToggle = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (response.ok) {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
      }
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });

      if (response.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchTodos();
  };

  const handleEdit = (updatedTodo: Todo) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
    );
  };

  // Filter logic
  const filteredTodos = todos.filter((todo) => {
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "active" && !todo.completed) ||
      (statusFilter === "completed" && todo.completed);
    const categoryMatch =
      categoryFilter.length === 0 || categoryFilter.includes(todo.category);
    return statusMatch && categoryMatch;
  });

  // Sort logic
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
    const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
    return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedTodos.length / rowsPerPage));
  const paginatedTodos = sortedTodos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (todos.length === 0) return;

    const headers = ["title", "description", "due_date", "category", "completed"];
    const rows = todos.map((todo) => [
      `"${(todo.title || "").replace(/"/g, '""')}"`,
      `"${(todo.description || "").replace(/"/g, '""')}"`,
      todo.due_date ? todo.due_date.split("T")[0] : "",
      todo.category || "",
      todo.completed ? "true" : "false",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todos-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <h1>To-Do List</h1>
      </header>

      <div className="page-content">
        {/* Tabs and Actions Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Left: Tabs */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-black mr-2">Tasks</span>
            <button className="btn btn-tab-active">
              <List className="icon-sm" />
              List
            </button>
            <button className="btn btn-tab-inactive">
              <Calendar className="icon-sm" />
              Calendar
            </button>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={handleExport}>
              <Download className="icon-sm" />
              Export
            </button>
            <button className="btn btn-outline" onClick={() => setIsImportOpen(true)}>
              <Upload className="icon-sm" />
              Import
            </button>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus className="icon-sm" />
              Create Task
            </button>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="search-input"
              readOnly
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <span className="filter-label">Status</span>
            <select
              className="pagination-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <span className="filter-label">Category</span>
            <div className="relative">
              <button
                className="pagination-select"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                {categoryFilter.length === 0 ? "All" : categoryFilter.join(", ")}
                <ChevronDown className="icon-xs" />
              </button>
              {showCategoryDropdown && (
                <div className="filter-dropdown">
                  {["Personal", "Work", "Shopping", "Health", "Urgent", "Other"].map((cat) => (
                    <label key={cat} className="filter-dropdown-item">
                      <input
                        type="checkbox"
                        checked={categoryFilter.includes(cat)}
                        onChange={() => {
                          setCategoryFilter((prev) =>
                            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                          );
                          setCurrentPage(1);
                        }}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <span className="text-gray-300">|</span>
            <span className="filter-label">Due date</span>
            <button
              className="filter-value"
              onClick={() => setSortOrder(sortOrder === "oldest" ? "newest" : "oldest")}
            >
              {sortOrder === "oldest" ? (
                <ChevronUp className="icon-xs" />
              ) : (
                <ChevronDown className="icon-xs" />
              )}
              {sortOrder === "oldest" ? "Oldest first" : "Newest first"}
            </button>
          </div>
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
        ) : (
          <TodoList
            todos={paginatedTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCreateClick={() => setIsModalOpen(true)}
          />
        )}

        {/* Pagination */}
        <div className="pagination">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              className="pagination-select"
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>Page {currentPage} of {totalPages}</span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="icon-sm" />
            </button>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="icon-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <AddTodo isOpen={isModalOpen} onClose={handleModalClose} />

      {/* Import Modal */}
      <ImportTodo isOpen={isImportOpen} onClose={() => { setIsImportOpen(false); fetchTodos(); }} />
    </div>
  );
}
