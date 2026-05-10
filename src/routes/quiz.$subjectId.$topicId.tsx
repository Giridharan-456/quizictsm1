import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react";
import { getSubject, getTopic, type Question } from "@/lib/quiz";

export const Route = createFileRoute("/quiz/$subjectId/$topicId")({
  head: () => ({
    meta: [
      { title: "Quiz — ICTSM" },
      { name: "description", content: "Swipe to select your answer." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { subjectId, topicId } = Route.useParams();
  const navigate = useNavigate();
  const subject = getSubject(subjectId);
  const topic = useMemo(() => getTopic(subjectId, topicId), [subjectId, topicId]);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  if (!subject || !topic) {
    return (
      <main className="mx-auto max-w-md px-5 py-10">
        <p className="text-muted-foreground">Topic not found.</p>
        <Link to="/home" className="mt-4 inline-block text-primary">
          Back home
        </Link>
      </main>
    );
  }

  const total = topic.questions.length;
  const done = index >= total;
  const q = !done ? topic.questions[index] : null;

  const onPick = (key: "A" | "B" | "C" | "D") => {
    if (picked || !q) return;
    setPicked(key);
    setAnswered((n) => n + 1);
    if (key === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setAnswered(0);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-8">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/subject/$subjectId", params: { subjectId } })}
          className="rounded-xl border border-border bg-card/60 p-2.5 text-muted-foreground transition hover:text-foreground"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="text-xs text-muted-foreground">
          {Math.min(index + 1, total)} of {total} · score {score}
        </div>
      </header>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(Math.min(index, total) / total) * 100}%` }}
        />
      </div>

      {done ? (
        <FinishedView
          score={score}
          total={total}
          onRestart={restart}
          backTo={subjectId}
        />
      ) : (
        <>
          <h1 className="mt-10 text-center text-xl font-semibold leading-snug">
            {q!.question}
          </h1>

          <div className="mt-8 space-y-3">
            {q!.options.map((o) => (
              <SwipeOption
                key={o.key}
                optionKey={o.key}
                text={o.text}
                state={
                  picked == null
                    ? "idle"
                    : o.key === q!.answer
                      ? "correct"
                      : o.key === picked
                        ? "wrong"
                        : "muted"
                }
                onPick={() => onPick(o.key)}
              />
            ))}
          </div>

          {picked && (
            <button
              onClick={next}
              className="mt-8 w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {index + 1 === total ? "See results" : "Next question"}
            </button>
          )}

          <p className="mt-6 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
            Swipe an option right to select
          </p>
        </>
      )}

      {!done && (
        <div className="mt-auto pt-6 text-center text-xs text-muted-foreground">
          {answered} answered · {Math.max(total - answered, 0)} left
        </div>
      )}
    </main>
  );
}

function SwipeOption({
  optionKey,
  text,
  state,
  onPick,
}: {
  optionKey: "A" | "B" | "C" | "D";
  text: string;
  state: "idle" | "correct" | "wrong" | "muted";
  onPick: () => void;
}) {
  const x = useMotionValue(0);
  const bg = useTransform(
    x,
    [0, 120],
    ["var(--card)", "color-mix(in oklab, var(--primary) 30%, var(--card))"],
  );
  const locked = state !== "idle";

  const onEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 90) {
      onPick();
    } else {
      x.set(0);
    }
  };

  const stateStyles =
    state === "correct"
      ? "border-[color:var(--success)] bg-[color-mix(in_oklab,var(--success)_22%,var(--card))]"
      : state === "wrong"
        ? "border-destructive bg-[color-mix(in_oklab,var(--destructive)_22%,var(--card))]"
        : state === "muted"
          ? "border-border bg-card/40 opacity-60"
          : "border-border bg-card";

  return (
    <motion.button
      type="button"
      onClick={() => !locked && onPick()}
      drag={locked ? false : "x"}
      dragConstraints={{ left: 0, right: 200 }}
      dragElastic={0.15}
      onDragEnd={onEnd}
      style={locked ? undefined : { background: bg, x }}
      whileTap={locked ? undefined : { scale: 0.99 }}
      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors ${stateStyles}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            state === "correct"
              ? "bg-[color:var(--success)] text-background"
              : state === "wrong"
                ? "bg-destructive text-destructive-foreground"
                : "bg-accent text-accent-foreground"
          }`}
        >
          {state === "correct" ? (
            <Check className="h-4 w-4" />
          ) : state === "wrong" ? (
            <X className="h-4 w-4" />
          ) : (
            optionKey
          )}
        </span>
        <span className="text-sm">{text}</span>
      </div>
      {state === "idle" && (
        <span className="shrink-0 text-[11px] uppercase tracking-widest text-muted-foreground">
          swipe →
        </span>
      )}
    </motion.button>
  );
}

function FinishedView({
  score,
  total,
  onRestart,
  backTo,
}: {
  score: number;
  total: number;
  onRestart: () => void;
  backTo: string;
}) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="mt-16 text-center">
      <div
        className="mx-auto flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold text-white"
        style={{ background: "var(--gradient-ictsm)" }}
      >
        {pct}%
      </div>
      <h2 className="mt-6 text-2xl font-bold">Nice work!</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        You got {score} of {total} correct.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
        <Link
          to="/subject/$subjectId"
          params={{ subjectId: backTo }}
          className="rounded-2xl border border-border bg-card/60 py-3 text-sm font-semibold transition hover:bg-card"
        >
          Choose another topic
        </Link>
      </div>
    </div>
  );
}
