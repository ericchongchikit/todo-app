import { NextResponse } from "next/server";
import pool from "@/src/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, dueDate, category } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO todos (title, description, due_date, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        title.trim(),
        description?.trim() || null,
        dueDate || null,
        category || "Personal",
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create todo:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
