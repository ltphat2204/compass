import { deleteTask, updateTask } from "@/lib/db";
import { notFound, readFields, storageError } from "@/lib/task-api";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const fields = await readFields(request, true);
  if (fields instanceof Response) return fields;
  const { id } = await context.params;
  try {
    const task = updateTask(id, fields);
    return task ? Response.json({ task }) : notFound();
  } catch {
    return storageError();
  }
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  try {
    return deleteTask(id) ? new Response(null, { status: 204 }) : notFound();
  } catch {
    return storageError();
  }
}
