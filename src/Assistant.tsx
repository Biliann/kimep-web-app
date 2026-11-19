import { useEffect, useRef, useState } from "react";
import { Bot, RotateCcw, Send, Square, X } from "lucide-react";
import { getLanguage, t, useContent, useLanguage } from "./i18n";
import { go, pages, type Page } from "./router";
import { Markdown } from "./assistant/markdown";
import { parseTags } from "./assistant/parse";
import { localAnswer } from "./assistant/local";
import { getSelectedProgram } from "./programSelection";
import "./assistant.css";

type Msg = { id: number; role: "user" | "assistant"; text: string; streaming?: boolean; offline?: boolean; note?: string };
const MAX_LEN = 1000;
const pageLabel: Record<Page, string> = { home: "Open Home", scores: "Open UNT scores", cost: "Open the tuition calculator", docs: "Open documents and dates", faq: "Open questions and contacts" };

export default function Assistant() {
  useLanguage();
  const { faq, sources, contacts } = useContent();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const ctrl = useRef<AbortController | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (!open) return;
    field.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); launcher.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [msgs, open]);
  useEffect(() => () => ctrl.current?.abort(), []);

  const chips = [t("What UNT score do I need for my program?"), t("How much is tuition per year?"), t("Which documents do I need and by when?"), t("Do I need IELTS?")];
  const patch = (id: number, p: Partial<Msg>) => setMsgs((m) => m.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const offline = (id: number, question: string, why: string) => {
    const a = localAnswer(question, faq);
    const adm = contacts[0];
    if (a) {
      const src = a.source && (sources as Record<string, { title: string }>)[a.source] ? ` [source:${a.source}]` : "";
      patch(id, { text: a.text + src + (a.page ? ` [page:${a.page}]` : ""), streaming: false, offline: true, note: why });
    } else {
      patch(id, { text: `${t("I could not find this in the handbook.")} ${t("Please ask Admissions")}: ${adm.email}, ${adm.phone}. [page:faq]`, streaming: false, offline: true, note: why });
    }
  };

  const send = async (raw: string) => {
    const text = raw.trim().slice(0, MAX_LEN);
    if (!text || busy) return;
    const userMsg: Msg = { id: nextId.current++, role: "user", text };
    const botId = nextId.current++;
    const history = [...msgs, userMsg];
    setMsgs([...history, { id: botId, role: "assistant", text: "", streaming: true }]);
    setInput("");
    setBusy(true);
    const c = new AbortController();
    ctrl.current = c;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: c.signal,
        body: JSON.stringify({
          messages: history.filter((m) => !m.offline || m.role === "user").slice(-12).map((m) => ({ role: m.role, content: m.text.slice(0, MAX_LEN) })),
          language: getLanguage(),
          programId: getSelectedProgram(),
        }),
      });
      if (!res.ok || !res.body) {
        const why = res.status === 429 ? t("Too many questions in a short time. Showing the handbook answer instead.") : t("The AI service is not available right now. Showing the handbook answer instead.");
        offline(botId, text, why);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        const cut = acc.lastIndexOf("\u001e"); // the server restarted the answer with another model
        if (cut >= 0) acc = acc.slice(cut + 1);
        patch(botId, { text: acc });
      }
      if (!acc.trim()) offline(botId, text, t("The AI service is not available right now. Showing the handbook answer instead."));
      else patch(botId, { streaming: false });
    } catch (e) {
      if ((e as Error).name === "AbortError") patch(botId, { streaming: false });
      else offline(botId, text, t("The AI service is not available right now. Showing the handbook answer instead."));
    } finally {
      setBusy(false);
      ctrl.current = null;
    }
  };

  const stop = () => ctrl.current?.abort();
  const reset = () => { ctrl.current?.abort(); setMsgs([]); setBusy(false); field.current?.focus(); };

  return (
    <>
      <button ref={launcher} type="button" className="asst-launch" aria-expanded={open} aria-controls="asst-panel" aria-label={open ? t("Close assistant") : t("Ask the assistant")} onClick={() => setOpen((o) => !o)}>
        {open ? <X aria-hidden="true" /> : <Bot aria-hidden="true" />}
        <span>{open ? t("Close assistant") : t("Ask the assistant")}</span>
      </button>
      {open && (
        <section className="asst-panel" id="asst-panel" aria-label={t("KIMEP Pathway assistant")}>
          <header>
            <div><b>{t("KIMEP Pathway assistant")}</b></div>
            <button type="button" className="icon" onClick={reset} aria-label={t("Start over")} title={t("Start over")}><RotateCcw aria-hidden="true" /></button>
            <button type="button" className="icon" onClick={() => { setOpen(false); launcher.current?.focus(); }} aria-label={t("Close assistant")}><X aria-hidden="true" /></button>
          </header>
          <div className="asst-log" ref={log} role="log" aria-live="polite" aria-relevant="additions text">
            {msgs.length === 0 && (
              <div className="asst-hello">
                <p>{t("Hi! Ask me about UNT scores, tuition, documents, deadlines or English. I answer only from KIMEP's official sources.")}</p>
                <div className="asst-chips">{chips.map((c) => <button key={c} type="button" onClick={() => send(c)}>{c}</button>)}</div>
              </div>
            )}
            {msgs.map((m) => {
              if (m.role === "user") return <div key={m.id} className="msg user"><p>{m.text}</p></div>;
              const { body, sources: srcIds, pages: pageIds } = parseTags(m.text, !!m.streaming);
              return (
                <div key={m.id} className="msg bot">
                  {m.note && <p className="asst-note">{m.note}</p>}
                  {body ? <Markdown text={body} /> : m.streaming ? <span className="dots" aria-label={t("Typing")}><i /><i /><i /></span> : null}
                  {!m.streaming && srcIds.length > 0 && (
                    <p className="asst-src">{t("Source")}: {srcIds.map((id, i) => { const s = (sources as Record<string, { url: string; title: string }>)[id]; return s ? <a key={id} href={s.url} target="_blank" rel="noreferrer" title={s.title}>{s.title.length > 30 ? s.title.slice(0, 28) + "…" : s.title}{i < srcIds.length - 1 ? " · " : ""}</a> : null; })}</p>
                  )}
                  {!m.streaming && pageIds.filter((p): p is Page => (pages as readonly string[]).includes(p)).map((p) => (
                    <button key={p} type="button" className="asst-go" onClick={() => { go(p); setOpen(false); }}>{t(pageLabel[p])}</button>
                  ))}
                </div>
              );
            })}
          </div>
          <form className="asst-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <label className="sr" htmlFor="asst-input">{t("Your question")}</label>
            <textarea id="asst-input" ref={field} rows={1} maxLength={MAX_LEN} value={input} placeholder={t("Type your question")}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} />
            {busy
              ? <button type="button" className="send stop" onClick={stop} aria-label={t("Stop")}><Square aria-hidden="true" /></button>
              : <button type="submit" className="send" disabled={!input.trim()} aria-label={t("Send")}><Send aria-hidden="true" /></button>}
          </form>
          <p className="asst-disc">{t("AI can make mistakes. Check important details with official KIMEP sources.")}</p>
        </section>
      )}
    </>
  );
}
