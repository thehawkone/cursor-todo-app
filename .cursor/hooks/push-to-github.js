#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const FLAG_PATH = path.join(process.cwd(), ".cursor", ".push-requested");
const SECRET_MARKERS = [".env", "credentials.json", "secrets.json", "id_rsa"];

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

function runGit(command, cwd) {
  return execSync(command, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function findRiskyFiles(statusOutput) {
  return statusOutput
    .split("\n")
    .map((line) => line.slice(3).trim())
    .filter((file) => file && SECRET_MARKERS.some((marker) => file.includes(marker)));
}

function pushToGitHub() {
  const cwd = process.cwd();
  const notes = [];
  const status = runGit("git status --porcelain", cwd);

  if (status) {
    const risky = findRiskyFiles(status);
    if (risky.length > 0) {
      throw new Error(
        `Refusing to commit possible secret files: ${risky.join(", ")}. Remove them from the changes first.`
      );
    }

    runGit("git add -A", cwd);
    const message = `chore: sync from Cursor session (${new Date().toISOString().slice(0, 10)})`;
    runGit(`git commit -m ${JSON.stringify(message)}`, cwd);
    notes.push("Committed local changes.");
  }

  const branch = runGit("git rev-parse --abbrev-ref HEAD", cwd);
  let ahead = 0;

  try {
    ahead = Number.parseInt(runGit("git rev-list --count @{u}..HEAD", cwd), 10);
  } catch {
    ahead = Number.NaN;
  }

  if (!status && (Number.isNaN(ahead) ? false : ahead === 0)) {
    return "Nothing to push: working tree is clean and branch is up to date with remote.";
  }

  runGit("git push -u origin HEAD", cwd);
  notes.push(`Pushed branch "${branch}" to GitHub.`);

  return notes.join(" ");
}

async function main() {
  const raw = await readStdin();
  const input = raw ? JSON.parse(raw) : {};

  if (input.status !== "completed" || !fs.existsSync(FLAG_PATH)) {
    process.stdout.write("{}");
    return;
  }

  fs.unlinkSync(FLAG_PATH);

  try {
    const message = pushToGitHub();
    process.stderr.write(`[push-hook] ${message}\n`);
    process.stdout.write("{}");
  } catch (error) {
    process.stderr.write(`[push-hook] push failed: ${error.message}\n`);
    process.stdout.write(
      JSON.stringify({
        followup_message: `GitHub push failed: ${error.message}`,
      })
    );
  }
}

main().catch((error) => {
  process.stderr.write(`[push-hook] unexpected error: ${error.message}\n`);
  process.stdout.write("{}");
});
