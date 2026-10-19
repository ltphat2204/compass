export function normalizeTaskTitle(value) {
  if (typeof value !== "string") {
    throw new TypeError("Task title must be a string");
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("Task title cannot be empty");
  }

  return trimmed.replace(/\s+/gu, " ");
}
