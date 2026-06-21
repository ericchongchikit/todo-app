export interface Todo {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  category: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export type FilterType = "all" | "active" | "completed";
