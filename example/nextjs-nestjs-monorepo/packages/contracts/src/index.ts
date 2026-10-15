export interface Task { id: string; title: string; completed: boolean; createdAt: string }
export interface CreateTaskRequest { title: string }
export interface UpdateTaskRequest { title?: string; completed?: boolean }
export interface TasksResponse { tasks: Task[] }
export interface TaskResponse { task: Task }
export interface ErrorResponse { error: { code: string; message: string } }
