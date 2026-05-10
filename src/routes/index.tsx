import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Monitor, Sparkles } from "lucide-react";
import { subjects } from "@/lib/quiz";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICTSM Quiz — Master your skills" },
      {
        name: "description",
        content:
          "Practice ITI ICTSM 2nd Year theory and Employability Skills with swipe-to-answer flashcards.",
      },
      { property: "og:title", content: "ICTSM Quiz" },
      {
        property: "og:description",
        content: "Practice & learn — one swipe at a time.",
      },
    ],
  }),
  component: Home,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "ictsm-theory": Monitor,
  "employability-skills": Briefcase,
};

function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-12 pt-10">
      <header className="flex flex-col items-center text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-3xl shadow-lg"
          style={{ background: "var(--gradient-ictsm)" }}
        >
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">ICTSM Quiz</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Master your skills, one question at a time
        </p>
      </header>

      <h2 className="mt-10 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Subjects
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {subjects.map((s) => {
          const Icon = ICONS[s.id] ?? Monitor;
          const total = s.topics.reduce((n, t) => n + t.questions.length, 0);
          return (
            <Link
              key={s.id}
              to="/subject/$subjectId"
              params={{ subjectId: s.id }}
              className="group relative overflow-hidden rounded-3xl p-5 text-white shadow-[var(--shadow-card)] transition active:scale-[0.98]"
              style={{ background: s.gradient }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-8 text-2xl font-bold leading-tight">
                {s.name}
              </h3>
              <div className="mt-4 flex items-end justify-between text-xs text-white/80">
                <div>
                  <div className="text-base font-semibold text-white">
                    {s.topics.length}
                  </div>
                  <div>topics</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold text-white">
                    {total}
                  </div>
                  <div>questions</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        ITI ICTSM 2nd Year · Practice &amp; Learn
      </p>
    </main>
  );
}
