"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddTodoProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setCategory("Personal");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          dueDate: dueDate || null,
          category,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create task");
      }

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create Task</h2>
            <p className="text-sm text-gray-500 mt-0.5">Add a new task to your list</p>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X className="icon-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label" htmlFor="task-title">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="Enter task title"
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              placeholder="Enter task description (optional)"
              className="modal-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="task-due-date">
              Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              className="modal-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="task-category">
              Category
            </label>
            <select
              id="task-category"
              className="modal-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Urgent">Urgent</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {error && <p className="text-sm text-red-500 mr-auto">{error}</p>}
          <button className="btn btn-outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTodo;
