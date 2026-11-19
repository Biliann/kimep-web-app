// One-step local setup: checks Node, asks for the NVIDIA key, verifies it, writes .env.local.
// Usage: npm run setup      (the key is typed in your terminal and stored only in .env.local)
import { existsSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";

const file = process.argv.find((a) => a.startsWith("--file="))?.slice(7) ?? ".env.local";
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 22 || (major === 22 && minor < 13)) {
  console.error(`Node ${process.versions.node} is too old. Install Node.js 22.13 or newer from https://nodejs.org and run again.`);
  process.exit(1);
}
const rl = createInterface({ input: process.stdin, output: process.stdout });
if (existsSync(file)) {
  const a = (await rl.question(`${file} already exists. Overwrite it? (y/N) `)).trim().toLowerCase();
  if (a !== "y") { console.log("Kept the existing file. Run: npm run dev"); rl.close(); process.exit(0); }
}
let key = (process.env.NVIDIA_API_KEY ?? "").trim();
if (!key) key = (await rl.question("Paste your NVIDIA API key (starts with nvapi-): ")).trim();
rl.close();
if (!key) { console.error("No key given. Without it the site works, but the assistant only answers from the FAQ."); process.exit(1); }

let status = 0;
try {
  const r = await fetch("https://integrate.api.nvidia.com/v1/models", { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(20000) });
  status = r.status;
} catch { /* offline or blocked: keep going, the key is only checked, not required to be reachable now */ }
if (status === 401 || status === 403) { console.error("NVIDIA rejected this key (HTTP " + status + "). Check that you copied all of it."); process.exit(1); }
console.log(status === 200 ? "Key accepted by NVIDIA." : "Could not verify the key right now (no network?). Saving it anyway.");

writeFileSync(file, [
  `NVIDIA_API_KEY=${key}`,
  "NIM_MODEL=google/gemma-4-31b-it",
  "NIM_FALLBACK_MODELS=mistralai/mistral-large-4-1t-a52b,nvidia/nemotron-3.5-lightning-30b-a3b",
  "NIM_FIRST_TOKEN_MS=12000",
  "",
].join("\n"), { mode: 0o600 });
console.log(`Saved ${file} (git-ignored). Now run:  npm run dev   and open http://localhost:5173`);
