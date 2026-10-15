import { createTask, listTasks } from "@/lib/db";
import { readFields, storageError } from "@/lib/task-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    return Response.json({ tasks: listTasks() });
  } catch {
    return storageError();
  }
}

export async function POST(request: Request) {
  const fields = await readFields(request);
  if (fields instanceof Response) return fields;
  try {
    return Response.json({ task: createTask(fields.title!) }, { status: 201 });
  } catch {
    return storageError();
  }
}
