#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const shellEnvKeys = new Set(Object.keys(process.env));

const usage = `
Deploy the SamCard backend on Render.

Setup:
  1. In Render, open the backend service settings and copy its Deploy Hook URL.
  2. Add it to .env.local:
     RENDER_BACKEND_DEPLOY_HOOK_URL=https://api.render.com/deploy/...

Commands:
  npm run deploy:backend
  npm run deploy:backend -- --dry-run
`;

function loadEnvFile(relativePath) {
  const filePath = resolve(repoRoot, relativePath);

  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const rawLine of lines) {
    let line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    if (line.startsWith("export ")) {
      line = line.slice("export ".length).trim();
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (!key || shellEnvKeys.has(key)) {
      continue;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function warnAboutLocalGitState() {
  const status = git(["status", "--short"]);

  if (status) {
    console.warn(
      "Warning: local changes are not deployed by Render until you commit and push them."
    );
  }

  const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);

  if (!upstream) {
    return;
  }

  const unpushedCommits = git(["log", `${upstream}..HEAD`, "--oneline"]);

  if (unpushedCommits) {
    console.warn(
      `Warning: this branch has commits not pushed to ${upstream}; Render may not deploy them yet.`
    );
  }
}

function getDeployHookUrl() {
  for (const file of [".env", "backend/.env", ".env.local", "backend/.env.local"]) {
    loadEnvFile(file);
  }

  return (
    process.env.RENDER_BACKEND_DEPLOY_HOOK_URL ||
    process.env.RENDER_DEPLOY_HOOK_URL ||
    ""
  ).trim();
}

function validateDeployHookUrl(hookUrl) {
  try {
    const url = new URL(hookUrl);

    if (url.protocol !== "https:") {
      throw new Error("Deploy hook URL must use https.");
    }

    return url;
  } catch (error) {
    console.error(
      `Invalid RENDER_BACKEND_DEPLOY_HOOK_URL: ${error instanceof Error ? error.message : error}`
    );
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage.trim());
    return;
  }

  const dryRun = args.includes("--dry-run");
  const hookUrl = getDeployHookUrl();

  if (!hookUrl) {
    console.error("Missing Render deploy hook URL.");
    console.error(
      "Add RENDER_BACKEND_DEPLOY_HOOK_URL to .env.local, then run npm run deploy:backend."
    );
    process.exit(1);
  }

  const url = validateDeployHookUrl(hookUrl);

  if (url.hostname !== "api.render.com") {
    console.warn(`Warning: deploy hook host is ${url.hostname}, expected api.render.com.`);
  }

  warnAboutLocalGitState();

  if (dryRun) {
    console.log("Dry run passed. Render deploy hook is configured.");
    return;
  }

  if (typeof fetch !== "function") {
    console.error("This deploy script requires Node.js 18 or newer.");
    process.exit(1);
  }

  console.log("Triggering Render backend deploy for https://samcard.onrender.com ...");

  const response = await fetch(url, { method: "POST" });
  const responseText = (await response.text()).trim();

  if (!response.ok) {
    console.error(`Render deploy hook failed with HTTP ${response.status}.`);

    if (responseText) {
      console.error(responseText);
    }

    process.exit(1);
  }

  console.log("Render accepted the backend deploy request.");

  if (responseText) {
    console.log(responseText);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
