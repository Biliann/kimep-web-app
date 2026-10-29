import { useEffect, useRef, useState } from "react";
import { Bot, X, ArrowUpRight, RotateCcw, MessageCircle } from "lucide-react";
import { t, useContent, useLanguage } from "./i18n";
import "./assistant.css";

const samples = [
  {
    index: 0,
    label: t("What UNT score do I need?"),
    page: "requirements",
    next: t("View requirements"),
  },
  {
    index: 1,
    label: t("Which UNT subjects do I need?"),
    page: "requirements",
    next: t("View requirements"),
  },
  {
    index: 2,
    label: t("Do I need IELTS?"),
    page: "english",
    next: t("Explore English placement"),
  },
  {
    index: 5,
    label: t("What medical documents do I need?"),
    page: "documents",
    next: t("Open documents checklist"),
  },
  {
    index: 9,
    label: t("How much does tuition cost?"),
    page: "tuition",
    next: t("See tuition and fees"),
  },
  {
    index: 7,
    label: t("Where do I apply?"),
    page: "apply",
    next: t("See application steps"),
  },
] as const;

type Turn = { sample: (typeof samples)[number]; id: number };
export default function AssistantDemo() {
  useLanguage();
  const { faq, sources, verified, program } = useContent();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  useEffect(() => { setTurns([]); }, [program.code]);
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcher.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (transcript.current)
      transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [turns, open]);

  function close() {
    setOpen(false);
    launcher.current?.focus({ preventScroll: true });
  }

  return (
    <div className="assistant-widget">
      {open && (
        <section
          className="assistant-panel"
          id="admissions-assistant-demo"
          role="dialog"
          aria-modal="false"
          aria-labelledby="assistant-title"
          aria-describedby="assistant-description"
        >
          <header className="assistant-header">
            <div className="assistant-avatar">
              <Bot size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 id="assistant-title">{t("Admissions assistant")}</h2>
              <span>{t("AI concept · MVP demo")}</span>
            </div>
            <button
              ref={closeButton}
              type="button"
              className="assistant-close"
              aria-label={t("Close assistant")}
              onClick={close}
            >
              <X size={19} />
            </button>
          </header>
          <p id="assistant-description" className="assistant-description">
            {t(
              "A preview of our planned AI assistant. Choose a sample question to see a predefined answer.",
            )}
          </p>
          <p className="assistant-program">{program.name}</p>
          <div
            ref={transcript}
            className="assistant-transcript"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label={t("Sample conversation")}
            tabIndex={0}
          >
            <div className="assistant-greeting">
              <span className="assistant-speaker">{t("ASSISTANT DEMO")}</span>
              <p>
                {t(
                  "Hi! Planning to apply to KIMEP? Let’s start with a common question.",
                )}
              </p>
            </div>
            {turns.map(({ sample, id }) => {
              const answer = faq[sample.index];
              return (
                <div className="assistant-turn" key={id}>
                  <div className="assistant-question">
                    <span className="assistant-speaker">{t("YOU")}</span>
                    <p>{t(sample.label)}</p>
                  </div>
                  <div className="assistant-answer">
                    <span className="assistant-speaker">
                      {t("ASSISTANT DEMO")}
                    </span>
                    <p>{answer.a}</p>
                    <a href={"#" + sample.page} onClick={close}>
                      {t(sample.next)}
                      <ArrowUpRight size={13} />
                    </a>
                    <a
                      className="assistant-source"
                      href={sources[answer.source].url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("Official source")}
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="assistant-samples">
            <div className="assistant-sample-heading">
              <span>
                {turns.length
                  ? t("Ask another sample question")
                  : t("Try a sample question")}
              </span>
              {turns.length > 0 && (
                <button type="button" onClick={() => setTurns([])}>
                  <RotateCcw size={12} />
                  {t("Start again")}
                </button>
              )}
            </div>
            <div className="assistant-question-list">
              {samples.map((sample) => (
                <button
                  type="button"
                  key={sample.index}
                  onClick={() =>
                    setTurns((previous) => [
                      ...previous.slice(-3),
                      { sample, id: nextId.current++ },
                    ])
                  }
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
          <div className="assistant-disclaimer">
            {t("Predefined answers · No live AI")}
            <br />
            <span>
              {t("Sources checked")}
              {verified}
              {t(". Confirm final rules with KIMEP.")}
            </span>
          </div>
        </section>
      )}
      <button
        ref={launcher}
        type="button"
        className="assistant-launcher"
        aria-label={
          open
            ? t("Close admissions assistant demo")
            : t("Open admissions assistant demo")
        }
        aria-expanded={open}
        aria-controls="admissions-assistant-demo"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X size={25} aria-hidden="true" />
        ) : (
          <>
            <MessageCircle size={25} aria-hidden="true" />
            <span className="assistant-launcher-text">
              {t("AI assistant")}
              <small>{t("Demo")}</small>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
