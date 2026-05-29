import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Briefcase, Monitor, ArrowUpRight, Sparkles } from "lucide-react";
import { subjects } from "@/lib/quiz";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICTSM Quiz — Practice, refined." },
      {
        name: "description",
        content:
          "Editorial practice cards for ITI ICTSM 2nd Year theory and Employability Skills.",
      },
      { property: "og:title", content: "ICTSM Quiz" },
      { property: "og:description", content: "Practice & learn — one card at a time." },
    ],
  }),
  component: Home,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "ictsm-theory": Monitor,
  "employability-skills": Briefcase,
};

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= subjects.length) {
        e.preventDefault();
        navigate({
          to: "/subject/$subjectId",
          params: { subjectId: subjects[n - 1].id },
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const totalQuestions = subjects.reduce(
    (n, s) => n + s.topics.reduce((m, t) => m + t.count, 0),
    0,
  );
  const totalTopics = subjects.reduce((n, s) => n + s.topics.length, 0);

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-md px-5 pb-16 pt-6 md:max-w-4xl md:px-10 lg:max-w-6xl lg:px-14">
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div
            className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ICTSM · Quiz
          </div>
        </div>
        <ThemeSwitcher />
      </header>

      {/* Editorial masthead */}
      <section className="mt-10 md:mt-16">
        <div
          className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="h-px flex-1 bg-border" />
          <span>Vol. 02 · ITI 2nd Year</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <h1 className="mt-6 text-[3rem] font-extrabold leading-[0.95] tracking-tight md:text-[6rem] lg:text-[7.5rem]">
          Practice,
          <br />
          <span className="italic font-light text-muted-foreground">refined.</span>
        </h1>

        <div className="mt-6 grid grid-cols-3 gap-4 md:max-w-md">
          <Stat n={subjects.length} label="Subjects" />
          <Stat n={totalTopics} label="Topics" />
          <Stat n={totalQuestions} label="Questions" />
        </div>
      </section>

      {/* Bento grid */}
      <section className="mt-12 md:mt-20">
        <div className="mb-4 flex items-end justify-between">
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Choose a subject
          </h2>
          <span
            className="text-[10px] uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ↵ press 1–{subjects.length}
          </span>
        </div>

        <div className="grid grid-cols-6 grid-rows-[auto] gap-3 md:gap-4">
          {subjects.map((s, i) => {
            const Icon = ICONS[s.id] ?? Monitor;
            const total = s.topics.reduce((n, t) => n + t.count, 0);
            const featured = i === 0;
            return (
              <Link
                key={s.id}
                to="/subject/$subjectId"
                params={{ subjectId: s.id }}
                className={[
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 transition",
                  "hover:border-foreground hover:-translate-y-0.5 active:translate-y-0",
                  featured
                    ? "col-span-6 row-span-2 min-h-[260px] md:col-span-4 md:min-h-[340px]"
                    : "col-span-6 min-h-[200px] md:col-span-2 md:min-h-[340px]",
                ].join(" ")}
              >
                {/* Index marker */}
                <div className="flex items-start justify-between">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    № {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    <kbd
                      className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline-block"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {i + 1}
                    </kbd>
                    <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-12" />
                  </div>
                </div>

                {/* Big icon mark */}
                <div
                  className={[
                    "pointer-events-none absolute opacity-[0.06] transition group-hover:opacity-[0.1]",
                    featured ? "-right-10 -bottom-16" : "-right-6 -bottom-10",
                  ].join(" ")}
                  aria-hidden
                >
                  <Icon
                    className={featured ? "h-72 w-72" : "h-52 w-52"}
                    strokeWidth={1.25}
                  />
                </div>

                <div className="relative">
                  <h3
                    className={[
                      "font-semibold leading-[1.05] tracking-tight",
                      featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl",
                    ].join(" ")}
                  >
                    {s.name}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    {s.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span
                      className="rounded-full border border-border bg-background px-2.5 py-1"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {s.topics.length} topics
                    </span>
                    <span
                      className="rounded-full border border-border bg-background px-2.5 py-1"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {total} questions
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Quote / philosophy tile */}
          <div className="relative col-span-6 row-span-1 overflow-hidden rounded-2xl border border-border bg-foreground p-6 text-background md:col-span-4 md:p-8">
            <span
              className="text-[10px] uppercase tracking-[0.3em] opacity-60"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              The method
            </span>
            <p className="mt-3 font-display text-2xl leading-snug tracking-tight md:text-3xl">
              One question. <span className="italic opacity-70">One answer.</span>{" "}
              No clutter, no noise — just the practice loop, repeated until it sticks.
            </p>
          </div>

          {/* Hot-keys tile */}
          <div className="col-span-3 rounded-2xl border border-border bg-card p-5 md:col-span-1">
            <div
              className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Hotkeys
            </div>
            <ul
              className="mt-3 space-y-2 text-xs"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <Hot label="open subject" k="1–9" />
              <Hot label="shuffle all" k="S" />
              <Hot label="answer" k="A/B/C/D" />
            </ul>
          </div>

          {/* Mini meta tile */}
          <div className="col-span-3 flex flex-col justify-between rounded-2xl border border-border bg-card p-5 md:col-span-1">
            <div
              className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Edition
            </div>
            <div className="mt-3">
              <div className="font-display text-3xl font-extrabold tracking-tight">
                02
              </div>
              <div
                className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ITI · year ii
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 flex items-center justify-between border-t border-border pt-6">
        <span
          className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          © ICTSM Quiz — Paper Edition
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Built with care
        </span>
      </footer>
    </main>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
        {n}
      </div>
      <div
        className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
    </div>
  );
}

function Hot({ label, k }: { label: string; k: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px]">
        {k}
      </kbd>
    </li>
  );
}
