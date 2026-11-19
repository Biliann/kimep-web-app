import { readFileSync } from "node:fs";
// Tiny .env.local loader for scripts (the secret is never printed).
export function loadEnvFile(file = ".env.local") {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* no file */ }
}
