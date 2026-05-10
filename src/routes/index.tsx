import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, User } from "lucide-react";
import { getUserName, setUserName } from "@/lib/user";

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
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const existing = getUserName();
    if (existing) navigate({ to: "/home" });
  }, [navigate]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const n = String(data.get("name") || "").trim();
    if (!n) return;
    setUserName(n);
    navigate({ to: "/home" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg"
            style={{ background: "var(--gradient-ictsm)" }}
          >
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
            ICTSM Quiz
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Master your skills, one question at a time
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-10 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur"
        >
          <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Your name to begin
          </label>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
          >
            Start Playing
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ITI ICTSM 2nd Year · Practice &amp; Learn
        </p>
      </div>
    </main>
  );
}
