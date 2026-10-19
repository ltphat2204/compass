import { execSync } from "node:child_process";
import fs from "node:fs";

const stubContent = `export function normalizeTaskTitle(value) {
  throw new Error("Not implemented");
}
`;

const positiveControl = `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") {
    throw new TypeError("Value must be a string");
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("Title cannot be empty after trimming");
  }
  return trimmed.replace(/\\s+/gu, " ");
}
`;

const nc1_TypeError = `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") {
    throw new Error("Value must be a string"); // Defect: Error instead of TypeError
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) throw new Error("empty");
  return trimmed.replace(/\\s+/gu, " ");
}
`;

const nc2_Case = `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") throw new TypeError("must be string");
  const trimmed = value.trim();
  if (trimmed.length === 0) throw new Error("empty");
  return trimmed.toLowerCase().replace(/\\s+/gu, " "); // Defect: forces lowercase
}
`;

const nc3_UnicodeWS = `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") throw new TypeError("must be string");
  // Defect: only replaces standard ASCII space ' ', leaves tabs and unicode whitespace
  const trimmed = value.replace(/^ +| +$/g, "");
  if (trimmed.length === 0) throw new Error("empty");
  return trimmed.replace(/  +/g, " ");
}
`;

const nc4_Empty = `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") throw new TypeError("must be string");
  // Defect: does not reject empty string or whitespace-only string
  const trimmed = value.trim();
  return trimmed.replace(/\\s+/gu, " ");
}
`;

function runSuite(label) {
  try {
    const out = execSync("node --test tests/task-title.test.mjs", { encoding: "utf8" });
    const passMatch = out.match(/ℹ pass (\d+)/);
    const failMatch = out.match(/ℹ fail (\d+)/);
    return {
      status: "PASS",
      passCount: passMatch ? parseInt(passMatch[1], 10) : 0,
      failCount: failMatch ? parseInt(failMatch[1], 10) : 0,
      summary: `Pass: ${passMatch ? passMatch[1] : 0}, Fail: ${failMatch ? failMatch[1] : 0}`
    };
  } catch (err) {
    const out = err.stdout || "";
    const passMatch = out.match(/ℹ pass (\d+)/);
    const failMatch = out.match(/ℹ fail (\d+)/);
    return {
      status: "FAIL",
      passCount: passMatch ? parseInt(passMatch[1], 10) : 0,
      failCount: failMatch ? parseInt(failMatch[1], 10) : 0,
      summary: `Pass: ${passMatch ? passMatch[1] : 0}, Fail: ${failMatch ? failMatch[1] : 0}`
    };
  }
}

const results = {};

try {
  // 1. Positive Control
  fs.writeFileSync("src/task-title.mjs", positiveControl, "utf8");
  results.positiveControl = runSuite("Positive Control");

  // 2. NC-1 (Throws Error instead of TypeError)
  fs.writeFileSync("src/task-title.mjs", nc1_TypeError, "utf8");
  results.nc1_TypeError = runSuite("NC-1: TypeError Violation");

  // 3. NC-2 (Forces lowercase)
  fs.writeFileSync("src/task-title.mjs", nc2_Case, "utf8");
  results.nc2_Case = runSuite("NC-2: Case Preservation Violation");

  // 4. NC-3 (ASCII space only, ignores Unicode)
  fs.writeFileSync("src/task-title.mjs", nc3_UnicodeWS, "utf8");
  results.nc3_UnicodeWS = runSuite("NC-3: Unicode Whitespace Violation");

  // 5. NC-4 (No empty check)
  fs.writeFileSync("src/task-title.mjs", nc4_Empty, "utf8");
  results.nc4_Empty = runSuite("NC-4: Empty Title Rejection Violation");
} finally {
  // Always restore original stub
  fs.writeFileSync("src/task-title.mjs", stubContent, "utf8");
}

console.log(JSON.stringify(results, null, 2));
