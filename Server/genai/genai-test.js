/* eslint-disable no-console */
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});

const fs = require("fs");
const path = require("path");

/* ================= CONFIG ================= */

const ROOT = path.resolve(__dirname, "..");
const CONTROLLERS_DIR = path.join(ROOT, "Controllers");
const GENAI_DIR = path.join(ROOT, "genai");
const SPECS_DIR = path.join(GENAI_DIR, "specs");

// Output test
const OUT_DIR = path.join(ROOT, "__tests__", "genai-unit");

// Report để chứng minh workflow
const REPORT_PATH = path.join(GENAI_DIR, "test-report.json");

// Gemini model
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/* ================= UTILS ================= */

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function write(p, s) {
  fs.writeFileSync(p, s, "utf8");
}

function append(p, s) {
  fs.appendFileSync(p, s, "utf8");
}

/* ================= GEMINI ================= */

let GoogleGenerativeAI;
try {
  ({ GoogleGenerativeAI } = require("@google/generative-ai"));
} catch {
  throw new Error(
    "Missing @google/generative-ai. Run: npm i @google/generative-ai"
  );
}

async function genWithGemini(prompt) {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY / GOOGLE_API_KEY");

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const r = await model.generateContent(prompt);
  return r.response.text();
}

function extractJS(text) {
  const m = text.match(/```(?:js|javascript)?([\s\S]*?)```/i);
  return m ? m[1].trim() : text.trim();
}

/* ================= CORE LOGIC ================= */

/**
 * Lấy danh sách hàm export từ controller source
 * KHÔNG require controller
 */
function getExportedFunctionsFromControllerSource(src) {
  const fns = new Set();

  // module.exports = { a, b, c }
  const objMatch = src.match(/module\.exports\s*=\s*{([\s\S]*?)}\s*;?/m);
  if (objMatch) {
    const body = objMatch[1];
    const re = /(?:^|,)\s*([A-Za-z_$][\w$]*)\s*(?=[:,}\n])/g;
    let m;
    while ((m = re.exec(body))) fns.add(m[1]);
  }

  // exports.foo =
  const re2 = /exports\.([A-Za-z_$][\w$]*)\s*=/g;
  let m2;
  while ((m2 = re2.exec(src))) fns.add(m2[1]);

  // module.exports.foo =
  const re3 = /module\.exports\.([A-Za-z_$][\w$]*)\s*=/g;
  let m3;
  while ((m3 = re3.exec(src))) fns.add(m3[1]);

  return [...fns];
}

/**
 * Bỏ comment khỏi file test
 */
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\s)\/\/.*$/gm, "");
}

/**
 * Chỉ công nhận là "đã test"
 * khi có describe('functionName')
 */
function getTestedFunctionsFromTestContent(testContent, fnNames) {
  const cleaned = stripComments(testContent);
  const tested = new Set();

  for (const fn of fnNames) {
    const reDescribe = new RegExp(
      `describe\\(\\s*['"\`]${fn}['"\`]`,
      "m"
    );
    if (reDescribe.test(cleaned)) tested.add(fn);
  }
  return tested;
}

/* ================= PATH HELPERS ================= */

function listControllers() {
  return fs
    .readdirSync(CONTROLLERS_DIR)
    .filter((f) => f.endsWith(".js"))
    .map((f) => path.join(CONTROLLERS_DIR, f));
}

function specForController(ctrlPath) {
  const base = path.basename(ctrlPath).replace(".js", "");
  return path.join(SPECS_DIR, `${base}.spec.md`);
}

function outTestPath(ctrlPath) {
  const base = path.basename(ctrlPath).replace(".js", "");
  return path.join(OUT_DIR, `${base}.genai.unit.test.js`);
}

/* ================= MAIN ================= */

async function main() {
  ensureDir(OUT_DIR);

  const onlyOne = process.argv[2] === "--one" ? process.argv[3] : null;
  const controllers = listControllers();

  const report = {
    generatedAt: new Date().toISOString(),
    model: MODEL_NAME,
    outputDir: OUT_DIR,
    mode: "incremental-generate-only",
    results: [],
  };

  console.log(`🔎 Found ${controllers.length} controller(s)`);
  console.log(`📁 Output tests: ${OUT_DIR}`);
  if (onlyOne) console.log(`⚙️ Mode: ONE controller → ${onlyOne}`);

  for (const ctrlPath of controllers) {
    const fileName = path.basename(ctrlPath);
    if (onlyOne && fileName !== onlyOne) continue;

    const specPath = specForController(ctrlPath);
    if (!fs.existsSync(specPath)) {
      console.log(`⚠️ NO SPEC: ${fileName}`);
      report.results.push({
        controller: fileName,
        action: "NO_SPEC",
      });
      continue;
    }

    const controllerSource = read(ctrlPath);
    const exportedFns = getExportedFunctionsFromControllerSource(
      controllerSource
    );

    const testPath = outTestPath(ctrlPath);
    const hasTestFile = fs.existsSync(testPath);
    const existingTest = hasTestFile ? read(testPath) : "";

    const testedFns = hasTestFile
      ? getTestedFunctionsFromTestContent(existingTest, exportedFns)
      : new Set();

    const missingFns = exportedFns.filter((fn) => !testedFns.has(fn));

    if (!hasTestFile) {
      console.log(`✍️ Creating test file for ${fileName}...`);
    } else if (missingFns.length > 0) {
      console.log(
        `➕ Generating tests for missing functions in ${fileName}: ${missingFns.join(
          ", "
        )}`
      );
    } else {
      console.log(`✅ No missing tests. Skip ${fileName}`);
      report.results.push({
        controller: fileName,
        action: "SKIPPED",
      });
      continue;
    }

    const modeText = hasTestFile
      ? `ONLY generate NEW Jest test blocks for these missing functions: ${missingFns.join(
          ", "
        )}.
DO NOT rewrite existing tests.`
      : `Generate a COMPLETE Jest unit test file for this controller.`;

    const prompt = `
You are generating Jest unit tests for an Express controller.

HARD RULES:
- CommonJS require
- Controller-level unit tests (mock models/DB)
- Do NOT start server
- Correct relative paths:
  Test file: Server/__tests__/genai-unit/<name>.genai.unit.test.js
  Controller: Server/Controllers/<name>.js
  Models: Server/models/*

INCREMENTAL RULE:
${modeText}

CONTROLLER SOURCE:
${controllerSource}

SPEC:
${read(specPath)}

EXISTING TEST FILE:
${hasTestFile ? existingTest : "(none)"}

Return ONLY runnable JS code.
`.trim();

    let genCode;
    try {
      genCode = extractJS(await genWithGemini(prompt));
    } catch (e) {
      console.error(`❌ GenAI error for ${fileName}:`, e.message);
      report.results.push({
        controller: fileName,
        action: "GENAI_ERROR",
        error: e.message,
      });
      continue;
    }

    if (!hasTestFile) {
      write(testPath, genCode + "\n");
      console.log(`✍️ Created test file: ${path.basename(testPath)}`);
      report.results.push({
        controller: fileName,
        action: "CREATED",
      });
    } else {
      append(
        testPath,
        `\n\n// ===== GENAI AUTO-APPEND (missing functions) =====\n${genCode}\n`
      );
      console.log(
        `➕ Appended tests for: ${missingFns.join(", ")}`
      );
      report.results.push({
        controller: fileName,
        action: "APPENDED",
        missingFns,
      });
    }
  }

  write(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\n📄 Test report saved: ${REPORT_PATH}`);
}

main();
