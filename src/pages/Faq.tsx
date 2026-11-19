import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { tf, useContent, useT } from "../i18n";
import { Accordion, Head, Sources } from "../components/ui";

function Questions() {
  const t = useT();
  const { faq, program } = useContent();
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const list = faq.map((f) => ({ ...f }));
    // The first two answers depend on the chosen program.
    list[0] = { ...list[0], q: tf("What UNT score do I need for {p}?", { p: program.name.replace(/^(Bachelor of|Бакалавр)\s*/i, "") }),
      a: program.creative ? t("Journalism uses two online creative exams; there is no total UNT threshold.")
        : `${t("Minimum overall")}: ${program.unt}/140. ${program.sectionNames.map((n, i) => `${n} ≥${program.sectionMinimums[i]}`).join("; ")}. ${t("Basic eligibility is not an admission or scholarship guarantee.")}` };
    list[1] = { ...list[1], q: t("Which profile subjects should I take?"), a: program.creative ? t("Creative exams instead of profile subjects.") : program.subjects.join(" + ") + ". " + t("Standard high-school route. Other education routes need individual review.") };
    const s = q.trim().toLowerCase();
    return s ? list.filter((f) => (f.q + " " + f.a).toLowerCase().includes(s)) : list;
  }, [faq, program, q, t]);
  return (
    <section className="section" id="questions">
      <label className="search">
        <span className="sr">{t("Search common questions")}</span>
        <Search aria-hidden="true" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search common questions")} />
      </label>
      <div role="list">
        {items.map((f) => (
          <div role="listitem" key={f.q}><Accordion title={f.q}><p>{f.a}</p></Accordion></div>
        ))}
        {items.length === 0 && <p className="muted">{t("No answer found. Try other words or ask the assistant.")}</p>}
      </div>
    </section>
  );
}

function Contacts() {
  const t = useT();
  const { contacts } = useContent();
  return (
    <section className="section" id="contacts">
      <h2>{t("Contacts")}</h2>
      <div className="contacts">
        {contacts.map((c) => (
          <div className="card contact" key={c.name}>
            <h3>{c.name}</h3>
            <span className="muted">{c.for}</span>
            {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
            {c.phone && <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>}
            {c.mobile && <a href={`tel:${c.mobile.replace(/\s/g, "")}`}>{c.mobile} · WhatsApp</a>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Faq() {
  const t = useT();
  return (
    <>
      <Head title={t("Questions")} />
      <div className="page">
        <Questions />
        <Contacts />
        <Sources ids={["school", "admission", "fees", "contacts"]} />
      </div>
    </>
  );
}
