"use client";

import { useState } from "react";
import { Todo } from "../types";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import EditTodo from "./EditTodo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (updatedTodo: Todo) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const formattedDate = todo.due_date
    ? new Date(todo.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const categoryColor = () => {
    switch (todo.category?.toLowerCase()) {
      case "urgent":
        return "todo-badge-urgent";
      case "work":
        return "todo-badge-work";
      case "health":
        return "todo-badge-health";
      case "shopping":
        return "todo-badge-shopping";
      default:
        return "todo-badge-personal";
    }
  };

  return (
    <>
      <div className={`todo-card ${todo.completed ? "bg-[#e6ffe6]":""}`}>
        {/* Top row: grip, checkbox, title, actions */}
        <div className="todo-card-top">
          {/* <GripVertical className="icon-sm text-gray-300 flex-shrink-0 cursor-grab" /> */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="todo-checkbox"
          />
          <span className={`todo-card-title ${todo.completed ? "line-through text-gray-400" : ""}`}>
            {todo.title}
          </span>
          <div className="todo-card-actions">
            <button className="todo-action-btn" onClick={() => setIsEditOpen(true)}>
              <Pencil className="icon-sm" />
            </button>
            <button className="todo-action-btn hover:text-red-500 hover:bg-red-50" onClick={() => onDelete(todo.id)}>
              <Trash2 className="icon-sm" />
            </button>
          </div>
        </div>

        {/* Description */}
        {todo.description && (
          <p className="todo-card-description">{todo.description}</p>
        )}

        {/* Bottom row: category badge + due date */}
        <div className="todo-card-bottom">
          <span className={`todo-badge ${categoryColor()}`}>{todo.category}</span>
          {formattedDate && (
            <span className="todo-card-due">Due: {formattedDate}</span>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditTodo
        todo={todo}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={onEdit}
      />
    </>
  );
}
