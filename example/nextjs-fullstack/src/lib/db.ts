import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import type { Task } from "./tasks.ts";

type TaskRow = Omit<Task, "completed"> & { completed: number };

function withDatabase<T>(operation: (db: DatabaseSync) => T): T {
  const path = resolve(/* turbopackIgnore: true */ process.env.DATABASE_PATH || "data/tasks.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  try {
    db.exec(`CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
      createdAt TEXT NOT NULL
    )`);
    return operation(db);
  } finally {
    db.close();
  }
}

function taskFromRow(row: TaskRow): Task {
  return { ...row, completed: row.completed === 1 };
}

export function initializeDatabase(): void {
  withDatabase(() => undefined);
}

export function listTasks(): Task[] {
  return withDatabase((db) =>
    (db.prepare("SELECT * FROM tasks ORDER BY createdAt DESC, id DESC").all() as TaskRow[])
      .map(taskFromRow),
  );
}

export function createTask(title: string): Task {
  return withDatabase((db) => {
    const task: Task = { id: randomUUID(), title, completed: false, createdAt: new Date().toISOString() };
    db.prepare("INSERT INTO tasks (id, title, completed, createdAt) VALUES (?, ?, ?, ?)")
      .run(task.id, task.title, 0, task.createdAt);
    return task;
  });
}

export function updateTask(id: string, fields: { title?: string; completed?: boolean }): Task | null {
  return withDatabase((db) => {
    const result = db.prepare(`UPDATE tasks SET
      title = COALESCE(?, title), completed = COALESCE(?, completed)
      WHERE id = ? RETURNING *`)
      .get(fields.title ?? null, fields.completed === undefined ? null : Number(fields.completed), id) as TaskRow | undefined;
    return result ? taskFromRow(result) : null;
  });
}

export function deleteTask(id: string): boolean {
  return withDatabase((db) => db.prepare("DELETE FROM tasks WHERE id = ?").run(id).changes > 0);
}
