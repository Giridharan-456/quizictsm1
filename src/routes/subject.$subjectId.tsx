import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Layers, Shuffle } from "lucide-react";
import { getSubject } from "@/lib/quiz";

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
        <Link to="/home" className="mt-4 inline-block text-primary">
          Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-12 pt-8">
      <button
        onClick={() => navigate({ to: "/home" })}
        className="rounded-xl border border-border bg-card/60 p-2.5 text-muted-foreground transition hover:text-foreground"
        aria-label="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">{subject.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Choose a topic</p>

      <Link
        to="/quiz/$subjectId/$topicId"
        params={{ subjectId: subject.id, topicId: "all" }}
        className="mt-6 flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] transition active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Shuffle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">All Topics Shuffled</div>
            <div className="text-xs text-muted-foreground">
              {subject.topics.reduce((n, t) => n + t.questions.length, 0)}{" "}
              questions
            </div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <ul className="mt-6 space-y-2">
        {subject.topics.map((t) => (
          <li key={t.id}>
            <Link
              to="/quiz/$subjectId/$topicId"
              params={{ subjectId: subject.id, topicId: t.id }}
              className="flex items-center justify-between rounded-2xl border border-border bg-card/40 p-4 transition hover:bg-card/70 active:scale-[0.99]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.questions.length} questions
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
