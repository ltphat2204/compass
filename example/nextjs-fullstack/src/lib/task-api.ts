import { normalizeTitle } from "./tasks";

export function apiError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status });
}

export function storageError(): Response {
  return apiError(500, "STORAGE_ERROR", "Không thể lưu hoặc đọc công việc. Vui lòng tải lại danh sách để kiểm tra.");
}

export function notFound(): Response {
  return apiError(404, "NOT_FOUND", "Công việc không còn tồn tại. Vui lòng tải lại danh sách.");
}

type Fields = { title?: string; completed?: boolean };

export async function readFields(request: Request, patch = false): Promise<Fields | Response> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return apiError(415, "UNSUPPORTED_MEDIA_TYPE", "Vui lòng gửi dữ liệu JSON.");
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(400, "INVALID_JSON", "Dữ liệu JSON không hợp lệ.");
  }
  const invalid = () => apiError(400, "INVALID_INPUT", "Tiêu đề phải có từ 1 đến 200 ký tự; trạng thái phải là boolean và chỉ được gửi các trường cho phép.");
  if (!body || typeof body !== "object" || Array.isArray(body)) return invalid();
  const fields = body as Record<string, unknown>;
  const keys = Object.keys(fields);
  if (!keys.length || keys.some((key) => key !== "title" && !(patch && key === "completed"))) return invalid();
  const result: Fields = {};
  if ("title" in fields) {
    const title = normalizeTitle(fields.title);
    if (title === null) return invalid();
    result.title = title;
  }
  if ("completed" in fields) {
    if (typeof fields.completed !== "boolean") return invalid();
    result.completed = fields.completed;
  }
  return result;
}
