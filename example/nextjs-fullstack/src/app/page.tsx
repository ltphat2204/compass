"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { normalizeTitle, type Task } from "@/lib/tasks";

type Filter = "all" | "active" | "completed";

async function fetchTasks(): Promise<Task[]> {
  const response = await fetch("/api/tasks", { cache: "no-store" });
  if (!response.ok) throw new Error("Không thể tải công việc. Vui lòng thử lại.");
  return (await response.json()).tasks;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [needsReload, setNeedsReload] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editError, setEditError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, setPending] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    fetchTasks().then((data) => {
      if (active) { setTasks(data); setLoaded(true); }
    }).catch((reason: Error) => {
      if (active) setError(reason.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function reload() {
    setLoading(true);
    setError("");
    try {
      setTasks(await fetchTasks());
      setLoaded(true);
      setNeedsReload(false);
    } catch {
      setError("Không thể tải công việc. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function mutate(key: string, method: string, id?: string, body?: object): Promise<boolean> {
    setPending((previous) => [...previous, key]);
    setError("");
    try {
      const response = await fetch(id ? `/api/tasks/${encodeURIComponent(id)}` : "/api/tasks", {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        if (response.status === 404 || response.status >= 500) setNeedsReload(true);
        const data = await response.json();
        setError(data.error?.message || "Không thể lưu công việc. Vui lòng tải lại danh sách để kiểm tra.");
        return false;
      }
      if (method === "DELETE") {
        setTasks((previous) => previous.filter((task) => task.id !== id));
      } else {
        const { task } = await response.json() as { task: Task };
        setTasks((previous) => (method === "POST"
          ? [...previous, task]
          : previous.map((item) => item.id === task.id ? task : item))
          .sort((a, b) => a.createdAt === b.createdAt
            ? (a.id < b.id ? 1 : a.id > b.id ? -1 : 0)
            : (a.createdAt < b.createdAt ? 1 : -1)));
      }
      return true;
    } catch {
      setNeedsReload(true);
      setError("Chưa xác định được kết quả lưu. Vui lòng tải lại danh sách để kiểm tra trước khi thử lại.");
      return false;
    } finally {
      setPending((previous) => previous.filter((item) => item !== key));
    }
  }

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = normalizeTitle(title);
    if (value === null) { setTitleError("Tiêu đề phải có từ 1 đến 200 ký tự."); return; }
    setTitleError("");
    if (await mutate("add", "POST", undefined, { title: value })) setTitle("");
  }

  async function saveTask(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const value = normalizeTitle(editTitle);
    if (value === null) { setEditError("Tiêu đề phải có từ 1 đến 200 ký tự."); return; }
    setEditError("");
    if (await mutate(id, "PATCH", id, { title: value })) setEditingId(null);
  }

  const visibleTasks = tasks.filter((task) => filter === "all" || task.completed === (filter === "completed"));
  const blocked = loading || !loaded || needsReload;

  return (
    <main>
      <header>
        <p className="eyebrow">Danh sách cá nhân</p>
        <h1>Quản lý công việc</h1>
        <p>Ghi lại việc cần làm và theo dõi tiến độ mỗi ngày.</p>
      </header>

      <form className="add-form" onSubmit={addTask}>
        <label htmlFor="new-title">Tiêu đề công việc</label>
        <div className="input-row">
          <input id="new-title" value={title} onChange={(event) => setTitle(event.target.value)}
            disabled={pending.includes("add")} aria-invalid={!!titleError}
            aria-describedby={titleError ? "title-error" : "title-hint"} />
          <button className="primary" type="submit" disabled={blocked || pending.includes("add")}>
            {pending.includes("add") ? "Đang thêm…" : "Thêm"}
          </button>
        </div>
        <p id="title-hint" className="hint">Từ 1 đến 200 ký tự.</p>
        {titleError && <p id="title-error" className="error" role="alert">{titleError}</p>}
      </form>

      <nav className="filters" aria-label="Lọc công việc">
        {([["all", "Tất cả"], ["active", "Chưa hoàn thành"], ["completed", "Đã hoàn thành"]] as const).map(([value, label]) => (
          <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>
        ))}
      </nav>

      <div className="list-heading">
        <h2>Công việc của bạn</h2>
        <button type="button" onClick={reload} disabled={loading || pending.length > 0}>
          {error && !needsReload ? "Thử lại" : "Tải lại danh sách"}
        </button>
      </div>
      <div aria-live="polite" role="status">{loading && <p>Đang tải công việc…</p>}</div>
      {error && <div className="error-panel" role="alert"><p>{error}</p>
        {needsReload && <p>Tải lại danh sách trước khi tiếp tục thay đổi công việc.</p>}
      </div>}
      {loaded && !loading && tasks.length === 0 && <p className="empty">Chưa có công việc nào. Hãy thêm công việc đầu tiên.</p>}
      {loaded && !loading && tasks.length > 0 && visibleTasks.length === 0 && <p className="empty">Không có công việc phù hợp với bộ lọc này.</p>}
      <ul className="tasks" aria-label="Danh sách công việc">
        {visibleTasks.map((task) => {
          const busy = pending.includes(task.id);
          return <li key={task.id}>
            {editingId === task.id ? (
              <form className="edit-form" onSubmit={(event) => saveTask(event, task.id)}>
                <label htmlFor={`edit-${task.id}`}>Sửa tiêu đề công việc</label>
                <input id={`edit-${task.id}`} value={editTitle} onChange={(event) => setEditTitle(event.target.value)}
                  disabled={busy} autoFocus aria-invalid={!!editError} aria-describedby={editError ? "edit-error" : undefined} />
                {editError && <p id="edit-error" className="error" role="alert">{editError}</p>}
                <div className="actions">
                  <button className="primary" type="submit" disabled={blocked || busy}>{busy ? "Đang lưu…" : "Lưu"}</button>
                  <button type="button" disabled={busy} onClick={() => setEditingId(null)}>Hủy</button>
                </div>
              </form>
            ) : (
              <>
                <label className="task-label">
                  <input type="checkbox" checked={task.completed} disabled={blocked || busy}
                    onChange={() => { void mutate(task.id, "PATCH", task.id, { completed: !task.completed }); }} />
                  <span className={task.completed ? "completed" : ""}>{task.title}</span>
                </label>
                <div className="actions">
                  <button type="button" disabled={blocked || busy} onClick={() => {
                    setEditingId(task.id); setEditTitle(task.title); setEditError("");
                  }}>Sửa</button>
                  <button className="danger" type="button" disabled={blocked || busy} onClick={() => {
                    if (window.confirm(`Xóa công việc “${task.title}”?`)) void mutate(task.id, "DELETE", task.id);
                  }}>Xóa</button>
                </div>
              </>
            )}
          </li>;
        })}
      </ul>
    </main>
  );
}
