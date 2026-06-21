# To-Do List Application

A full-stack to-do list application built with Next.js, React, TypeScript, and PostgreSQL.

## Tech Stack

| Layer     | Technology               |
| --------- | ------------------------ |
| Framework | Next.js 16               |
| Language  | TypeScript 5             |
| Frontend  | React 19, Tailwind CSS 4 |
| Database  | PostgreSQL               |

## Features

- Create, edit, and delete tasks
- Mark tasks as completed (checkbox toggle)
- Filter by status (All / Active / Completed)
- Filter by category (multi-select: Personal, Work, Shopping, Health, Urgent, Other)
- Sort by due date (oldest first / newest first)
- Pagination with configurable rows per page (1–4 / All)
- Import tasks from CSV file
- Export tasks to CSV file
- Responsive modal dialogs for all actions

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) running locally

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Make sure PostgreSQL is running, then create the database:

```bash
psql -U postgres -c "CREATE DATABASE todoapp;"
```

Create the `todos` table:

```bash
psql -U postgres -d todoapp -f src/lib/init.sql
```

### 3. Configure environment variables

Create a `.env` file in the root directory (or update the existing one):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todoapp"
```

Replace `postgres:postgres` with your actual PostgreSQL username and password if different.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── todos/
│   │       ├── route.ts          # GET (list) & POST (create) todos
│   │       ├── [id]/
│   │       │   └── route.ts      # PATCH (update) & DELETE todo by ID
│   │       └── import/
│   │           └── route.ts      # POST bulk import from CSV
│   ├── globals.css               # Tailwind CSS + custom component styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page (client component)
├── src/
│   ├── components/
│   │   ├── AddTodo.tsx           # Create task modal
│   │   ├── EditTodo.tsx          # Edit task modal
│   │   ├── ImportTodo.tsx        # Import CSV modal
│   │   ├── TodoList.tsx          # Todo list container
│   │   ├── TodoItem.tsx          # Individual todo card
│   │   ├── Calendar.tsx          # Calendar view component
│   │   └── Filters.tsx           # Filter component
│   ├── lib/
│   │   ├── db.ts                 # PostgreSQL connection pool
│   │   └── init.sql              # Database schema
│   └── types.ts                  # TypeScript interfaces
├── public/
│   └── sample-tasks.csv          # Sample CSV for testing import
├── .env                          # Environment variables
├── package.json
├── tsconfig.json
└── next.config.ts
```

## API Endpoints

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/todos`        | Fetch all todos      |
| POST   | `/api/todos`        | Create a new todo    |
| PATCH  | `/api/todos/[id]`   | Update a todo        |
| DELETE | `/api/todos/[id]`   | Delete a todo        |
| POST   | `/api/todos/import` | Bulk import from CSV |

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  category VARCHAR(50) DEFAULT 'Personal',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
