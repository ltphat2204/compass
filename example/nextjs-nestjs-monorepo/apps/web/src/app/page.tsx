'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateTaskRequest, ErrorResponse, Task, TaskResponse, TasksResponse, UpdateTaskRequest } from '@example/contracts';

const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
function apiOrigin(): string | null {
  try {
    if (!configuredUrl) return null;
    const url = new URL(configuredUrl);
    return ['http:', 'https:'].includes(url.protocol) && url.origin === configuredUrl ? configuredUrl : null;
  } catch { return null; }
}
const origin = apiOrigin();
const configError = 'Lỗi cấu hình: NEXT_PUBLIC_API_URL phải là origin HTTP(S) của API (ví dụ http://localhost:3001).';
class ApiError extends Error {}
function validTitle(value: string) {
  const length = [...value.trim()].length;
  return length >= 1 && length <= 200;
}
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [reconcile, setReconcile] = useState(false);
  const [title, setTitle] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('all');

  async function load() {
    setLoading(true);
    setLoadError('');
    if (!origin) { setLoadError(configError); setLoading(false); return; }
    try {
      const response = await fetch(`${origin}/api/tasks`, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const data: TasksResponse = await response.json();
      setTasks(data.tasks);
      setReconcile(false);
      setError('');
    } catch { setLoadError('Không thể tải công việc. Kiểm tra kết nối và thử lại.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    let active = true;
    if (!origin) return;
    fetch(`${origin}/api/tasks`, { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) throw new Error();
      const data: TasksResponse = await response.json();
      if (active) setTasks(data.tasks);
    }).catch(() => { if (active) setLoadError('Không thể tải công việc. Kiểm tra kết nối và thử lại.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function mutate(method: 'POST' | 'PATCH' | 'DELETE', id?: string, body?: CreateTaskRequest | UpdateTaskRequest): Promise<boolean> {
    if (!origin || pending || loading || reconcile || loadError) return false;
    setPending(true);
    setError('');
    try {
      const response = await fetch(`${origin}/api/tasks${id ? `/${encodeURIComponent(id)}` : ''}`, {
        method, headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        const data: ErrorResponse = await response.json();
        throw new ApiError(data.error.message);
      }
      if (method === 'DELETE') setTasks((old) => old.filter((task) => task.id !== id));
      else {
        const data: TaskResponse = await response.json();
        setTasks((old) => (method === 'POST' ? [data.task, ...old] : old.map((task) => task.id === id ? data.task : task))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id)));
      }
      return true;
    } catch (cause) {
      if (cause instanceof ApiError) setError(cause.message);
      else {
        setReconcile(true);
        setError('Mất kết nối khi lưu. Dữ liệu có thể đã được lưu; hãy tải lại danh sách trước khi tiếp tục.');
      }
      return false;
    } finally { setPending(false); }
  }
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validTitle(title)) { setError('Tiêu đề phải có từ 1 đến 200 ký tự.'); return; }
    if (await mutate('POST', undefined, { title })) setTitle('');
  }
  async function save(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    if (!validTitle(draft)) { setError('Tiêu đề phải có từ 1 đến 200 ký tự.'); return; }
    if (await mutate('PATCH', id, { title: draft })) setEditing(null);
  }
  const locked = pending || loading || reconcile || !!loadError || !origin;
  const visible = tasks.filter((task) => filter === 'all' || task.completed === (filter === 'done'));
  return <main>
    <header><p className="eyebrow">QUẢN LÝ CÁ NHÂN</p><h1>Công việc của tôi</h1><p>Ghi lại việc cần làm, hoàn thành từng việc một.</p></header>
    {!origin && <p role="alert" className="error">{configError}</p>}
    <form onSubmit={create} className="add-form">
      <label htmlFor="new-title">Công việc mới</label>
      <div className="input-row"><input id="new-title" value={title} onChange={(event) => setTitle(event.target.value)} disabled={pending} aria-describedby={error ? 'mutation-error' : undefined} placeholder="Bạn cần làm gì?"/><button type="submit" disabled={locked}>Thêm</button></div>
    </form>
    {error && <p id="mutation-error" role="alert" className="error">{error}</p>}
    {(reconcile || loadError) && <button onClick={load} disabled={loading || pending}>Thử lại</button>}
    <nav aria-label="Lọc công việc" className="filters">{[['all', 'Tất cả'], ['todo', 'Chưa hoàn thành'], ['done', 'Đã hoàn thành']].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</nav>
    <section aria-label="Danh sách công việc" aria-busy={pending || loading}>
      {origin && loading && <p role="status">Đang tải công việc…</p>}
      {loadError && <p role="alert" className="error">{loadError}</p>}
      {origin && !loading && !loadError && tasks.length === 0 && <p className="empty">Chưa có công việc nào. Hãy thêm công việc đầu tiên.</p>}
      {!loading && !loadError && tasks.length > 0 && visible.length === 0 && <p className="empty">Không có công việc phù hợp với bộ lọc.</p>}
      {!loading && !loadError && <ul>{visible.map((task) => <li key={task.id}>
        <label className="completion"><input type="checkbox" checked={task.completed} disabled={locked} aria-label={`Hoàn thành: ${task.title}`} onChange={(event) => { void mutate('PATCH', task.id, { completed: event.target.checked }); }}/><span className={task.completed ? 'done' : ''}>{task.title}</span></label>
        {editing === task.id ? <form className="edit-form" onSubmit={(event) => save(event, task.id)}><label htmlFor={`edit-${task.id}`}>Sửa tiêu đề</label><input id={`edit-${task.id}`} value={draft} onChange={(event) => setDraft(event.target.value)} disabled={pending} aria-describedby={error ? 'mutation-error' : undefined}/><div className="actions"><button disabled={locked}>Lưu</button><button type="button" disabled={pending} onClick={() => setEditing(null)}>Hủy</button></div></form> : <div className="actions"><button disabled={locked} onClick={() => { setEditing(task.id); setDraft(task.title); }}>Sửa</button><button className="delete" disabled={locked} onClick={async () => { if (window.confirm(`Xóa công việc “${task.title}”?`)) await mutate('DELETE', task.id); }}>Xóa</button></div>}
      </li>)}</ul>}
    </section>
  </main>;
}
