import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight, Shuffle } from "lucide-react";
import { getSubject } from "@/lib/quiz";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const Route = createFileRoute("/subject/$subjectId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subjectId} — ICTSM Quiz` },
      { name: "description", content: "Choose a topic to practise." },
    ],
  }),
  component: SubjectPage,
});

function SubjectPage() {
  const { subjectId } = Route.useParams();
  const navigate = useNavigate();
  const subject = getSubject(subjectId);

  useEffect(() => {
    if (!subject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      if (e.key === "Escape") {
        e.preventDefault();
        navigate({ to: "/" });
        return;
      }
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        navigate({
          to: "/quiz/$subjectId/$topicId",
          params: { subjectId: subject.id, topicId: "all" },
        });
        return;
      }
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= Math.min(9, subject.topics.length)) {
        e.preventDefault();
        navigate({
          to: "/quiz/$subjectId/$topicId",
          params: { subjectId: subject.id, topicId: subject.topics[n - 1].id },
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [subject, navigate]);

  if (!subject) {
    return (
      <main className="mx-auto max-w-md px-5 py-10">
        <p className="text-muted-foreground">Subject not found.</p>
        <Link to="/" className="mt-4 inline-block underline">
          Back home
        </Link>
      </main>
    );
  }

  const total = subject.topics.reduce((n, t) => n + t.count, 0);

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-md px-5 pb-16 pt-6 md:max-w-4xl md:px-10 lg:max-w-6xl lg:px-14">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/" })}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span
          className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ICTSM · Quiz
        </span>
        <ThemeSwitcher />
      </header>

      {/* Masthead */}
      <section className="mt-10 md:mt-14">
        <div
          className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {subject.description}
        </div>
        <h1 className="mt-4 text-[2.5rem] font-extrabold leading-[0.95] tracking-tight md:text-7xl">
          {subject.name}
        </h1>
        <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span
            className="rounded-full border border-border bg-card px-2.5 py-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {subject.topics.length} topics
          </span>
          <span
            className="rounded-full border border-border bg-card px-2.5 py-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {total} questions
          </span>
        </div>
      </section>

      {/* Shuffle hero */}
      <Link
        to="/quiz/$subjectId/$topicId"
        params={{ subjectId: subject.id, topicId: "all" }}
        className="group mt-8 flex items-center justify-between overflow-hidden rounded-2xl border border-foreground bg-foreground p-5 text-background transition hover:-translate-y-0.5 md:p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-background/20">
            <Shuffle className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-xl font-bold leading-tight md:text-2xl">
              All Topics, Shuffled
            </div>
            <div
              className="mt-0.5 text-[10px] uppercase tracking-[0.22em] opacity-70"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {total} questions · randomized
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <kbd
            className="hidden rounded border border-background/30 px-1.5 py-0.5 text-[10px] md:inline-block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            S
          </kbd>
          <ArrowUpRight className="h-5 w-5 transition group-hover:rotate-12" />
        </div>
      </Link>

      {/* Topics grid (bento-ish) */}
      <h2
        className="mt-12 mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Topics
      </h2>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {subject.topics.map((t, i) => (
          <li key={t.id}>
            <Link
              to="/quiz/$subjectId/$topicId"
              params={{ subjectId: subject.id, topicId: t.id }}
              className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground"
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  № {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  {i < 9 && (
                    <kbd
                      className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline-block"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {i + 1}
                    </kbd>
                  )}
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:rotate-12 group-hover:text-foreground" />
                </div>
              </div>
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
                  {t.name}
                </h3>
                <div
                  className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t.count} questions
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
