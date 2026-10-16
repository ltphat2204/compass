import { Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Task, UpdateTaskRequest } from '@example/contracts';

@Injectable()
export class TasksService implements OnModuleDestroy {
  private readonly db: DatabaseSync;
  constructor() {
    const path = process.env.DATABASE_PATH;
    if (!path?.trim()) throw new Error('DATABASE_PATH is required.');
    try {
      if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
      this.db = new DatabaseSync(path);
      this.db.exec(`CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY, title TEXT NOT NULL, completed INTEGER NOT NULL CHECK(completed IN (0,1)), createdAt TEXT NOT NULL
      ) STRICT`);
    } catch { throw new Error('Cannot open or initialize DATABASE_PATH. Check the path and permissions.'); }
  }
  onModuleDestroy() { this.db.close(); }
  private task(row: Record<string, unknown>): Task {
    return { id: row.id as string, title: row.title as string, completed: row.completed === 1, createdAt: row.createdAt as string };
  }
  list(): Task[] { return this.db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC, id DESC').all().map((row) => this.task(row)); }
  create(title: string): Task {
    const task: Task = { id: randomUUID(), title, completed: false, createdAt: new Date().toISOString() };
    this.db.prepare('INSERT INTO tasks (id,title,completed,createdAt) VALUES (?,?,0,?)').run(task.id, task.title, task.createdAt);
    return task;
  }
  update(id: string, input: UpdateTaskRequest): Task {
    const row = this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!row) throw new NotFoundException();
    const task = { ...this.task(row), ...input };
    this.db.prepare('UPDATE tasks SET title=?, completed=? WHERE id=?').run(task.title, task.completed ? 1 : 0, id);
    return task;
  }
  delete(id: string) {
    if (!this.db.prepare('DELETE FROM tasks WHERE id=?').run(id).changes) throw new NotFoundException();
  }
}
