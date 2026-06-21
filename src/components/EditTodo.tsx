"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Todo } from "../types";

interface EditTodoProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTodo: Todo) => void;
}

export default function EditTodo({ todo, isOpen, onClose, onSave }: EditTodoProps) {

  console.log(todo)
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState(
    todo.due_date ? todo.due_date.split("T")[0] : ""
  );
  const [category, setCategory] = useState(todo.category);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
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
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          due_date: dueDate || null,
          category,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update task");
      }

      const updatedTodo = await response.json();
      onSave(updatedTodo);
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
            <h2 className="modal-title">Edit Task</h2>
            <p className="text-sm text-gray-500 mt-0.5">Update your task details</p>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X className="icon-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label" htmlFor="edit-title">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              placeholder="Enter task title"
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="edit-description">
              Description
            </label>
            <textarea
              id="edit-description"
              placeholder="Enter task description (optional)"
              className="modal-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="edit-due-date">
              Due Date
            </label>
            <input
              id="edit-due-date"
              type="date"
              className="modal-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="edit-category">
              Category
            </label>
            <select
              id="edit-category"
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
