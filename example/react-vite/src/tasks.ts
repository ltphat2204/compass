export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export const STORAGE_KEY = 'compass-example-react-vite.tasks.v1'

export function seedTasks(): Task[] {
  return [
    { id: 'sample-1', title: 'Lên kế hoạch cho tuần mới', completed: false, createdAt: '2026-01-03T09:00:00.000Z' },
    { id: 'sample-2', title: 'Đọc một chương sách', completed: false, createdAt: '2026-01-02T09:00:00.000Z' },
    { id: 'sample-3', title: 'Sắp xếp góc làm việc', completed: true, createdAt: '2026-01-01T09:00:00.000Z' },
  ]
}

export function validateTitle(value: string): string {
  const title = value.trim()
  if (Array.from(title).length < 1 || Array.from(title).length > 200) {
    throw new Error('Tiêu đề cần có từ 1 đến 200 ký tự.')
  }
  return title
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value)) return false
  const date = new Date(value)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 19) === value.slice(0, 19)
}

export function parseTasks(raw: string): Task[] {
  const value: unknown = JSON.parse(raw)
  if (!Array.isArray(value)) throw new Error('Dữ liệu công việc không hợp lệ.')
  const ids = new Set<string>()
  for (const task of value) {
    if (!task || typeof task !== 'object' || typeof task.id !== 'string' || !task.id.trim() || ids.has(task.id) ||
      typeof task.title !== 'string' || validateTitle(task.title) !== task.title ||
      typeof task.completed !== 'boolean' || typeof task.createdAt !== 'string' || !validDate(task.createdAt)) {
      throw new Error('Dữ liệu công việc không hợp lệ.')
    }
    ids.add(task.id)
  }
  return value as Task[]
}

export function saveTasks(storage: Pick<Storage, 'setItem'>, tasks: Task[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function loadTasks(storage: Pick<Storage, 'getItem' | 'setItem'>): Task[] {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw !== null) return parseTasks(raw)
  const tasks = seedTasks()
  saveTasks(storage, tasks)
  return tasks
}
