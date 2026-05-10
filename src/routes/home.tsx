import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Monitor, Briefcase, LogOut } from "lucide-react";
import { subjects } from "@/lib/quiz";
import { clearUser, getUserName } from "@/lib/user";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Choose a subject — ICTSM Quiz" },
      { name: "description", content: "Pick a subject to begin practising." },
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
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const n = getUserName();
    if (!n) {
      navigate({ to: "/" });
      return;
    }
    setName(n);
  }, [navigate]);

  if (!name) return null;

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-12 pt-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {name} · ready to learn?
          </p>
        </div>
        <button
          aria-label="Sign out"
          onClick={() => {
            clearUser();
            navigate({ to: "/" });
          }}
          className="rounded-xl border border-border bg-card/60 p-2.5 text-muted-foreground transition hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
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
    </main>
  );
}
