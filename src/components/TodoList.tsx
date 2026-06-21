"use client";

import { Todo } from "../types";
import TodoItem from "./TodoItem";
import { ClipboardCheck, Plus } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (updatedTodo: Todo) => void;
  onCreateClick: () => void;
}

export default function TodoList({ todos, onToggle, onDelete, onEdit, onCreateClick }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <ClipboardCheck className="empty-state-icon" strokeWidth={1.5} />
          <h3 className="empty-state-title">No tasks yet</h3>
          <p className="empty-state-description">Get started by creating your first task.</p>
          <button className="btn btn-outline px-4 py-2" onClick={onCreateClick}>
            <Plus className="icon-sm" />
            Create Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
