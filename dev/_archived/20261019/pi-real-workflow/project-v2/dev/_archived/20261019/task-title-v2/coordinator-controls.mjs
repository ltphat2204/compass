import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const PROJECT_ROOT = process.cwd();
const SRC_FILE = path.join(PROJECT_ROOT, "src", "task-title.mjs");
const TEST_FILE = path.join(PROJECT_ROOT, "tests", "task-title.test.mjs");
const PKG_FILE = path.join(PROJECT_ROOT, "package.json");

function sha256(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

const initialSrcHash = sha256(SRC_FILE);

console.log("=== Coordinator Control Harness ===");
console.log(`Original src/task-title.mjs hash: ${initialSrcHash}`);

// Define implementation variants
const VARIANTS = {
  // 1. Production Stub (current src/task-title.mjs)
  stub: fs.readFileSync(SRC_FILE, "utf-8"),

  // 2. Spec-derived Positive Reference Implementation
  positiveReference: `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") {
    throw new TypeError("Task title must be a string");
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("Task title cannot be empty after trimming");
  }
  return trimmed.replace(/\\s+/gu, " ");
}
`,

  // 3. Plausible Wrong-Rule Mutant A: Missing Type Check (converts to string or allows non-string)
  mutantMissingTypeCheck: `export function normalizeTaskTitle(value) {
  const str = String(value);
  const trimmed = str.trim();
  if (trimmed.length === 0) {
    throw new Error("Task title cannot be empty");
  }
  return trimmed.replace(/\\s+/gu, " ");
}
`,

  // 4. Plausible Wrong-Rule Mutant B: Missing Trimming
  mutantMissingTrimming: `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") {
    throw new TypeError("Must be string");
  }
  if (value.length === 0) {
    throw new Error("Cannot be empty");
  }
  return value.replace(/\\s+/gu, " ");
}
`,

  // 5. Plausible Wrong-Rule Mutant C: Missing Internal Whitespace Collapse
  mutantMissingCollapse: `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") {
    throw new TypeError("Must be string");
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("Cannot be empty");
  }
  return trimmed;
}
`,

  // 6. Plausible Wrong-Rule Mutant D: Case Mutation (lowercases all characters)
  mutantLowercasing: `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") {
    throw new TypeError("Must be string");
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("Cannot be empty");
  }
  return trimmed.replace(/\\s+/gu, " ").toLowerCase();
}
`,

  // 7. Plausible Wrong-Rule Mutant E: Throws TypeError instead of Error on empty title
  mutantThrowsTypeErrorOnEmpty: `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") {
    throw new TypeError("Must be string");
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new TypeError("Task title cannot be empty");
  }
  return trimmed.replace(/\\s+/gu, " ");
}
`,

  // 8. Plausible Wrong-Rule Mutant F: Accepts empty / whitespace without throwing
  mutantAcceptsEmpty: `export function normalizeTaskTitle(value) {
  if (typeof value !== "string") {
    throw new TypeError("Must be string");
  }
  return value.trim().replace(/\\s+/gu, " ");
}
`,
};

const results = [];

for (const [name, code] of Object.entries(VARIANTS)) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `coord-control-${name}-`));
  const tempSrcDir = path.join(tempDir, "src");
  const tempTestsDir = path.join(tempDir, "tests");
  fs.mkdirSync(tempSrcDir, { recursive: true });
  fs.mkdirSync(tempTestsDir, { recursive: true });

  fs.writeFileSync(path.join(tempDir, "package.json"), fs.readFileSync(PKG_FILE));
  fs.writeFileSync(path.join(tempSrcDir, "task-title.mjs"), code);
  fs.writeFileSync(path.join(tempTestsDir, "task-title.test.mjs"), fs.readFileSync(TEST_FILE));

  let exitCode = 0;
  let stdout = "";
  let stderr = "";

  try {
    stdout = execFileSync("node", ["--test", "tests/task-title.test.mjs"], {
      cwd: tempDir,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    exitCode = err.status || 1;
    stdout = err.stdout || "";
    stderr = err.stderr || "";
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  const passed = exitCode === 0;
  results.push({
    variant: name,
    exitCode,
    passed,
    stdoutSummary: stdout.split("\n").filter((l) => l.startsWith("# pass") || l.startsWith("# fail")).join(" | "),
  });
}

const finalSrcHash = sha256(SRC_FILE);
console.log(`Final src/task-title.mjs hash:    ${finalSrcHash}`);

if (initialSrcHash !== finalSrcHash) {
  console.error("CRITICAL ERROR: src/task-title.mjs was modified during control runs!");
  process.exit(1);
}

console.log("\n=== Control Results Summary ===");
console.table(results);

// Assert expectations:
// 1. stub must fail
const stubResult = results.find((r) => r.variant === "stub");
if (stubResult.passed) {
  console.error("FAILED: Stub control unexpectedly passed!");
  process.exit(1);
}

// 2. positiveReference must pass 100%
const posResult = results.find((r) => r.variant === "positiveReference");
if (!posResult.passed) {
  console.error("FAILED: Positive reference control unexpectedly failed!");
  process.exit(1);
}

// 3. all wrong-rule mutants must fail
const mutants = results.filter((r) => r.variant !== "stub" && r.variant !== "positiveReference");
for (const m of mutants) {
  if (m.passed) {
    console.error(`FAILED: Wrong-rule mutant ${m.variant} unexpectedly passed!`);
    process.exit(1);
  }
}

console.log("\nALL CONTROLS PASSED EXPECTATIONS:");
console.log("- Stub control failed meaningfully as expected.");
console.log("- Positive reference control passed 100% of test suite.");
console.log("- All 6 plausible wrong-rule mutants were correctly caught and failed by test suite assertions.");
console.log("- Production file src/task-title.mjs remained byte-for-byte untouched.");
