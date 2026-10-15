export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export function normalizeTitle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const title = value.trim();
  return [...title].length >= 1 && [...title].length <= 200 ? title : null;
}
