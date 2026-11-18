import { defineConfig, loadEnv, type Plugin } from "vite";

// Serves the same /api/chat handler that Vercel runs in production, so `npm run dev`
// needs no `vercel dev`. Secrets are read from .env.local on the server side only.
function chatApi(): Plugin {
  const passEnv = (mode: string) => {
    const env = loadEnv(mode, process.cwd(), "");
    for (const k of ["NVIDIA_API_KEY", "NIM_MODEL", "NIM_FALLBACK_MODELS", "NIM_FIRST_BYTE_MS", "NIM_FIRST_TOKEN_MS", "NIM_TOTAL_MS", "NIM_CHAIN_MS", "NIM_IDLE_MS", "ALLOWED_ORIGINS", "CHAT_RATE_LIMIT"])
      if (env[k] && !process.env[k]) process.env[k] = env[k];
  };
  return {
    name: "kimep-chat-api",
    configureServer(server) {
      passEnv(server.config.mode);
      server.middlewares.use("/api/chat", async (req, res) => {
        try {
          const mod = await server.ssrLoadModule("/server/chat.ts");
          await mod.default(req, res);
        } catch (e) {
          console.error("[chat] handler error", e);
          if (!res.headersSent) { res.statusCode = 500; res.setHeader("Content-Type", "application/json"); }
          res.end(JSON.stringify({ error: "unavailable" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [chatApi()],
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
});
