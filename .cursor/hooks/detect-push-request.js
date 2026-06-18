#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const PUSH_PATTERNS = [
  /\/push\b/i,
  /\bpush\b.*\bgithub\b/i,
  /\bgithub\b.*\bpush\b/i,
  /запуш/i,
  /push\s+на\s+github/i,
];

const FLAG_PATH = path.join(process.cwd(), ".cursor", ".push-requested");

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });
}

async function main() {
  const raw = await readStdin();
  const input = raw ? JSON.parse(raw) : {};
  const prompt = input.prompt || "";

  if (!PUSH_PATTERNS.some((pattern) => pattern.test(prompt))) {
    process.stdout.write(JSON.stringify({ continue: true }));
    return;
  }

  fs.mkdirSync(path.dirname(FLAG_PATH), { recursive: true });
  fs.writeFileSync(
    FLAG_PATH,
    JSON.stringify(
      {
        requestedAt: new Date().toISOString(),
        prompt: prompt.slice(0, 500),
      },
      null,
      2
    )
  );

  process.stderr.write("[push-hook] Push requested — will run after agent completes.\n");
  process.stdout.write(JSON.stringify({ continue: true }));
}

main().catch((error) => {
  process.stderr.write(`[push-hook] detect error: ${error.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }));
});
