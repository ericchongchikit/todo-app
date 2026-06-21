"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";

interface ImportTodoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportTodo({ isOpen, onClose }: ImportTodoProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setFile(null);
    setError("");
    setResult("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) throw new Error("File must have a header row and at least one data row");

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    // Validate required column
    if (!headers.includes("title")) {
      throw new Error("CSV must have a 'title' column");
    }

    const todos = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length === 0 || (values.length === 1 && values[0] === "")) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      if (!row.title) continue;

      todos.push({
        title: row.title,
        description: row.description || null,
        dueDate: row.due_date || row.duedate || row["due date"] || null,
        category: row.category || "Personal",
      });
    }

    if (todos.length === 0) throw new Error("No valid tasks found in file");
    return todos;
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setIsImporting(true);
    setError("");
    setResult("");

    try {
      const text = await file.text();
      const todos = parseCSV(text);

      const response = await fetch("/api/todos/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todos }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to import tasks");
      }

      const data = await response.json();
      setResult(`Successfully imported ${data.count} task(s)`);
      setTimeout(() => handleClose(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Import Tasks</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Upload a CSV file to import tasks in bulk.
            </p>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X className="icon-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label" htmlFor="import-file">
              File
            </label>
            <input
              ref={fileInputRef}
              id="import-file"
              type="file"
              accept=".csv"
              onChange={(e) => { setFile(e.target.files?.[0] || null); setError(""); setResult(""); }}
              className="modal-input file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <p className="text-xs text-gray-400 mt-1">
              Supported format: .csv (max 5MB). Must include a &quot;title&quot; column.
            </p>
          </div>

          {file && (
            <p className="text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {error && <p className="text-sm text-red-500 mr-auto">{error}</p>}
          {result && <p className="text-sm text-green-600 mr-auto">{result}</p>}
          <button className="btn btn-outline" onClick={handleClose} disabled={isImporting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleImport} disabled={isImporting}>
            {isImporting ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
