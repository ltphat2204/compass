import { initializeDatabase } from "../src/lib/db.ts";

try {
  initializeDatabase();
  console.log("Đã khởi tạo cơ sở dữ liệu.");
} catch {
  console.error("Không thể khởi tạo cơ sở dữ liệu. Kiểm tra cấu hình DATABASE_PATH và quyền ghi.");
  process.exitCode = 1;
}
