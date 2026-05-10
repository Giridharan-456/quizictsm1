import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Briefcase, Monitor, Sparkles, ArrowRight } from "lucide-react";
import { subjects } from "@/lib/quiz";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AmbientBackground } from "@/components/AmbientBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICTSM Quiz — Master your skills" },
      {
        name: "description",
        content:
          "Practice ITI ICTSM 2nd Year theory and Employability Skills with swipe-to-answer cards.",
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

const CARD_GRADIENTS = ["var(--gradient-card-a)", "var(--gradient-card-b)"];

function Home() {
  return (
    <>
      <AmbientBackground />
      <main className="relative z-10 mx-auto min-h-screen w-full max-w-md px-5 pb-16 pt-6 md:max-w-3xl md:px-8 lg:max-w-5xl lg:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl glow-primary"
              style={{ background: "var(--gradient-card-a)" }}
            >
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">
                ICTSM Quiz
              </div>
              <div
                className="text-[10px] uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                practice · learn
              </div>
            </div>
          </div>
          <ThemeSwitcher />
        </header>

        <section className="mt-12">
          <div
            className="text-[11px] uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Welcome back
          </div>
          <h1 className="mt-2 text-[2.5rem] font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Master your <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-card-a)" }}
            >
              skills.
            </span>
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Swipe to answer. Learn at your own pace across {subjects.length}{" "}
            subjects and{" "}
            {subjects.reduce(
              (n, s) => n + s.topics.reduce((m, t) => m + t.count, 0),
              0,
            )}{" "}
            questions.
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Subjects
            </h2>
            <span
              className="text-[10px] text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {subjects.length} total
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {subjects.map((s, i) => {
              const Icon = ICONS[s.id] ?? Monitor;
              const total = s.topics.reduce(
                (n, t) => n + t.count,
                0,
              );
              return (
                <Link
                  key={s.id}
                  to="/subject/$subjectId"
                  params={{ subjectId: s.id }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 backdrop-blur-xl transition hover:border-[color:var(--ring)] active:scale-[0.99]"
                >
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-40 blur-3xl transition group-hover:opacity-60"
                    style={{
                      background:
                        CARD_GRADIENTS[i % CARD_GRADIENTS.length],
                    }}
                  />
                  <div className="relative flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
                      style={{
                        background:
                          CARD_GRADIENTS[i % CARD_GRADIENTS.length],
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
                  </div>
                  <h3 className="relative mt-7 text-xl font-semibold leading-tight">
                    {s.name}
                  </h3>
                  <p className="relative mt-1 text-xs text-muted-foreground">
                    {s.description}
                  </p>
                  <div
                    className="relative mt-5 flex items-center gap-4 text-[11px] text-muted-foreground"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span>
                      <span className="text-foreground">{s.topics.length}</span>{" "}
                      topics
                    </span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span>
                      <span className="text-foreground">{total}</span> questions
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <p
          className="mt-12 text-center text-[10px] uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ITI ICTSM · 2nd year
        </p>
      </main>
    </>
  );
}
