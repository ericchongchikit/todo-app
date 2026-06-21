import { NextResponse } from "next/server";
import pool from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { todos } = body;

    if (!todos || !Array.isArray(todos) || todos.length === 0) {
      return NextResponse.json(
        { error: "No tasks to import" },
        { status: 400 }
      );
    }

    // Build bulk insert query
    const values: unknown[] = [];
    const placeholders: string[] = [];

    todos.forEach((todo, index) => {
      const offset = index * 4;
      placeholders.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`
      );
      values.push(
        todo.title,
        todo.description || null,
        todo.dueDate || null,
        todo.category || "Personal"
      );
    });

    const query = `
      INSERT INTO todos (title, description, due_date, category)
      VALUES ${placeholders.join(", ")}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    return NextResponse.json(
      { count: result.rows.length, todos: result.rows },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to import todos:", error);
    return NextResponse.json(
      { error: "Failed to import tasks" },
      { status: 500 }
    );
  }
}
