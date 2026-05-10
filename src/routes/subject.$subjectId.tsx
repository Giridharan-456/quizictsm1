import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Layers, Shuffle } from "lucide-react";
import { getSubject } from "@/lib/quiz";
import { AmbientBackground } from "@/components/AmbientBackground";
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

  if (!subject) {
    return (
      <main className="mx-auto max-w-md px-5 py-10">
        <p className="text-muted-foreground">Subject not found.</p>
        <Link to="/" className="mt-4 inline-block text-[color:var(--primary)]">
          Back home
        </Link>
      </main>
    );
  }

  const total = subject.topics.reduce((n, t) => n + t.questions.length, 0);

  return (
    <>
      <AmbientBackground />
      <main className="relative z-10 mx-auto min-h-screen max-w-md px-5 pb-16 pt-6">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/" })}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card backdrop-blur-md transition hover:border-[color:var(--ring)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <ThemeSwitcher />
        </header>

        <div className="mt-10">
          <div
            className="text-[11px] uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {subject.description}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {subject.name}
          </h1>
          <p
            className="mt-2 text-xs text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {subject.topics.length} topics · {total} questions
          </p>
        </div>

        <Link
          to="/quiz/$subjectId/$topicId"
          params={{ subjectId: subject.id, topicId: "all" }}
          className="mt-6 flex items-center justify-between rounded-2xl border border-[color:var(--ring)]/40 bg-card p-4 backdrop-blur-xl transition glow-primary active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[color:var(--primary-foreground)]"
              style={{ background: "var(--primary)" }}
            >
              <Shuffle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">All Topics Shuffled</div>
              <div
                className="text-[11px] text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {total} questions
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <h2
          className="mt-8 mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Topics
        </h2>

        <ul className="space-y-2">
          {subject.topics.map((t, i) => (
            <li key={t.id}>
              <Link
                to="/quiz/$subjectId/$topicId"
                params={{ subjectId: subject.id, topicId: t.id }}
                className="flex items-center justify-between rounded-2xl border border-border bg-card/60 p-4 backdrop-blur transition hover:border-[color:var(--ring)] hover:bg-card active:scale-[0.99]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent)] text-[color:var(--accent-foreground)]">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.name}</div>
                    <div
                      className="text-[11px] text-muted-foreground"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {String(i + 1).padStart(2, "0")} · {t.questions.length}{" "}
                      questions
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
