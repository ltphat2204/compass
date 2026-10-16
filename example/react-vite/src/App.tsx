import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { parseTasks, saveTasks, seedTasks, sortTasks, STORAGE_KEY, validateTitle } from './tasks'
import type { Task } from './tasks'
import './App.css'

type Filter = 'all' | 'open' | 'done'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [ready, setReady] = useState(false)
  const [readFailed, setReadFailed] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editError, setEditError] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    let raw: string | null
    try { raw = localStorage.getItem(STORAGE_KEY) }
    catch {
      setReadFailed(true)
      setError('Không thể đọc dữ liệu trong trình duyệt. Thao tác lưu đã bị khóa.')
      return
    }
    if (raw !== null) {
      try { setTasks(parseTasks(raw)); setReady(true) }
      catch { setInvalid(true); setError('Dữ liệu đã lưu không hợp lệ. Bạn có thể đặt lại dữ liệu mẫu.') }
    } else {
      try { const samples = seedTasks(); saveTasks(localStorage, samples); setTasks(samples); setReady(true) }
      catch { setError('Không thể lưu dữ liệu mẫu. Hãy thử đặt lại dữ liệu mẫu.'); setInvalid(true) }
    }
  }, [])

  function commit(next: Task[]): boolean {
    if (readFailed) return false
    try { saveTasks(localStorage, next); setTasks(next); setError(''); return true }
    catch { setError('Không thể lưu dữ liệu. Nội dung được giữ nguyên; hãy thử lại.'); return false }
  }

  function add(event: FormEvent) {
    event.preventDefault()
    try {
      const valid = validateTitle(title)
      setTitleError('')
      if (commit([...tasks, { id: crypto.randomUUID(), title: valid, completed: false, createdAt: new Date().toISOString() }])) setTitle('')
    } catch (cause) { setTitleError((cause as Error).message) }
  }

  function edit(event: FormEvent, task: Task) {
    event.preventDefault()
    try {
      const valid = validateTitle(editTitle)
      setEditError('')
      if (commit(tasks.map(item => item.id === task.id ? { ...item, title: valid } : item))) setEditing(null)
    } catch (cause) { setEditError((cause as Error).message) }
  }

  const visible = sortTasks(tasks).filter(task => filter === 'all' || task.completed === (filter === 'done'))
  const blocked = !ready || readFailed || invalid

  return (
    <main className="workspace">
      <header><p className="eyebrow">KHÔNG GIAN CÁ NHÂN</p><h1>Công việc của bạn</h1><p className="intro">Từng việc nhỏ, một ngày nhẹ nhàng hơn.</p></header>
      {error && <p role="alert" className="error">{error}</p>}
      <section className="panel" aria-labelledby="add-heading">
        <h2 id="add-heading">Bạn muốn làm gì hôm nay?</h2>
        <form onSubmit={add} className="add-form">
          <div className="field"><label htmlFor="new-title">Tiêu đề công việc</label><input id="new-title" value={title} onChange={event => setTitle(event.target.value)} placeholder="Ví dụ: Đọc một chương sách" disabled={blocked} aria-invalid={!!titleError} aria-describedby={titleError ? 'title-error' : undefined} /></div>
          <button className="primary" disabled={blocked}>Thêm</button>
          {titleError && <p id="title-error" role="alert" className="error field-error">{titleError}</p>}
        </form>
      </section>
      <section className="panel list-panel" aria-labelledby="list-heading">
        <div className="list-header"><h2 id="list-heading">Danh sách công việc</h2><span className="count">{tasks.filter(task => !task.completed).length} chưa hoàn thành</span></div>
        <div className="filters" role="group" aria-label="Lọc công việc">{([['all', 'Tất cả'], ['open', 'Chưa hoàn thành'], ['done', 'Đã hoàn thành']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
        {ready && visible.length === 0 && <p className="empty">{tasks.length === 0 ? 'Chưa có công việc. Thêm một việc để bắt đầu.' : 'Không có công việc phù hợp với bộ lọc này.'}</p>}
        <ul className="tasks">{visible.map(task => <li key={task.id} className={task.completed ? 'completed' : ''}>
          <input type="checkbox" checked={task.completed} disabled={blocked} aria-label={`Hoàn thành: ${task.title}`} onChange={() => commit(tasks.map(item => item.id === task.id ? { ...item, completed: !item.completed } : item))} />
          {editing === task.id ? <form className="edit-form" onSubmit={event => edit(event, task)}><label htmlFor={`edit-${task.id}`}>Sửa tiêu đề công việc</label><input id={`edit-${task.id}`} autoFocus value={editTitle} onChange={event => setEditTitle(event.target.value)} aria-invalid={!!editError} aria-describedby={editError ? 'edit-error' : undefined} /><div className="actions"><button className="primary" disabled={blocked}>Lưu</button><button type="button" onClick={() => { setEditing(null); setEditError('') }}>Hủy</button></div>{editError && <p className="error" id="edit-error" role="alert">{editError}</p>}</form> : <><span className="task-title">{task.title}</span><div className="actions"><button disabled={blocked} onClick={() => { setEditing(task.id); setEditTitle(task.title); setEditError('') }}>Sửa</button><button className="delete" disabled={blocked} onClick={() => { if (window.confirm(`Xóa công việc “${task.title}”?`)) commit(tasks.filter(item => item.id !== task.id)) }}>Xóa</button></div></>}
        </li>)}</ul>
      </section>
      <footer><span>Dữ liệu được lưu trong trình duyệt của bạn.</span><button disabled={readFailed} onClick={() => { if (window.confirm('Đặt lại dữ liệu mẫu? Danh sách hiện tại sẽ được thay thế.')) { if (commit(seedTasks())) { setReady(true); setInvalid(false); setEditing(null); setTitle(''); setTitleError(''); setEditError('') } } }}>Đặt lại dữ liệu mẫu</button></footer>
    </main>
  )
}
