import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react";
import { getSubject, loadTopic, type Question } from "@/lib/quiz";
import { AmbientBackground } from "@/components/AmbientBackground";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const Route = createFileRoute("/quiz/$subjectId/$topicId")({
  head: () => ({
    meta: [
      { title: "Quiz — ICTSM" },
      { name: "description", content: "Swipe to select your answer." },
    ],
  }),
  loader: async ({ params }) => {
    const topic = await loadTopic(params.subjectId, params.topicId);
    return { topic };
  },
  pendingComponent: () => (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-5">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" />
    </main>
  ),
  component: QuizPage,
});

function QuizPage() {
  const { subjectId } = Route.useParams();
  const { topic } = Route.useLoaderData();
  const navigate = useNavigate();
  const subject = getSubject(subjectId);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [score, setScore] = useState(0);

  if (!subject || !topic) {
    return (
      <main className="mx-auto max-w-md px-5 py-10">
        <p className="text-muted-foreground">Topic not found.</p>
        <Link to="/" className="mt-4 inline-block text-[color:var(--primary)]">
          Back home
        </Link>
      </main>
    );
  }

  const total = topic.questions.length;
  const done = index >= total;
  const q: Question | null = !done ? topic.questions[index] : null;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  const onPick = (key: "A" | "B" | "C" | "D") => {
    if (picked || !q) return;
    setPicked(key);
    const correct = key === q.answer;
    if (correct) setScore((s) => s + 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(advance, correct ? 450 : 1500);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  // Keyboard shortcuts: A/B/C/D or 1/2/3/4
  useEffect(() => {
    if (!q || picked) return;
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, "A" | "B" | "C" | "D"> = {
        a: "A", b: "B", c: "C", d: "D",
        "1": "A", "2": "B", "3": "C", "4": "D",
      };
      const k = map[e.key.toLowerCase()];
      if (k) onPick(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, picked]);

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIndex(0);
    setPicked(null);
    setScore(0);
  };

  const progress = (Math.min(index, total) / total) * 100;

  return (
    <>
      <AmbientBackground />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-6 md:max-w-2xl md:px-8">
        <header className="flex items-center justify-between">
          <button
            onClick={() =>
              navigate({ to: "/subject/$subjectId", params: { subjectId } })
            }
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card backdrop-blur-md transition hover:border-[color:var(--ring)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div
            className="text-[11px] uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {Math.min(index + 1, total).toString().padStart(2, "0")} /{" "}
            {total.toString().padStart(2, "0")}
          </div>
          <ThemeSwitcher />
        </header>

        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-[color:var(--muted)]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--primary)" }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div
          className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--success)" }}
          />
          score · {score}
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
            <motion.h1
              key={q!.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-10 text-balance text-center text-xl font-semibold leading-snug md:text-2xl"
            >
              {q!.question}
            </motion.h1>

            <div className="mt-8 space-y-3">
              {q!.options.map((o, i) => (
                <SwipeOption
                  key={`${q!.id}-${o.key}`}
                  optionKey={o.key}
                  text={o.text}
                  index={i}
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

            <p
              className="mt-7 text-center text-[10px] uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {picked
                ? picked === q!.answer
                  ? "Correct →"
                  : "Showing answer…"
                : "Swipe an option right · or tap to select"}
            </p>
          </>
        )}
      </main>
    </>
  );
}

function SwipeOption({
  optionKey,
  text,
  state,
  index,
  onPick,
}: {
  optionKey: "A" | "B" | "C" | "D";
  text: string;
  state: "idle" | "correct" | "wrong" | "muted";
  index: number;
  onPick: () => void;
}) {
  const x = useMotionValue(0);
  const glow = useTransform(x, [0, 140], [0, 1]);
  const bg = useTransform(
    x,
    [0, 140],
    ["var(--card)", "color-mix(in oklab, var(--primary) 35%, var(--card))"],
  );
  const locked = state !== "idle";

  const onEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) onPick();
    else x.set(0);
  };

  const stateRing =
    state === "correct"
      ? "border-[color:var(--success)]"
      : state === "wrong"
        ? "border-[color:var(--destructive)]"
        : state === "muted"
          ? "border-border opacity-50"
          : "border-border";

  const stateBg =
    state === "correct"
      ? "color-mix(in oklab, var(--success) 22%, var(--card))"
      : state === "wrong"
        ? "color-mix(in oklab, var(--destructive) 22%, var(--card))"
        : undefined;

  const badgeBg =
    state === "correct"
      ? "var(--success)"
      : state === "wrong"
        ? "var(--destructive)"
        : "var(--accent)";

  const badgeFg =
    state === "correct" || state === "wrong"
      ? "#ffffff"
      : "var(--accent-foreground)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative"
    >
      {!locked && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            opacity: glow,
            boxShadow: "0 0 32px 2px var(--glow)",
          }}
        />
      )}
      <motion.button
        type="button"
        onClick={() => !locked && onPick()}
        drag={locked ? false : "x"}
        dragConstraints={{ left: 0, right: 220 }}
        dragElastic={0.18}
        onDragEnd={onEnd}
        style={
          locked
            ? { background: stateBg }
            : { background: bg, x }
        }
        whileTap={locked ? undefined : { scale: 0.99 }}
        className={`relative flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left backdrop-blur transition-colors ${stateRing}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: badgeBg,
              color: badgeFg,
              fontFamily: "var(--font-mono)",
            }}
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
          <span
            className="hidden shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground sm:hidden [@media(hover:none)]:inline"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            swipe →
          </span>
        )}
      </motion.button>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-16 text-center"
    >
      <div
        className="mx-auto flex h-32 w-32 items-center justify-center rounded-full text-3xl font-bold text-[color:var(--primary-foreground)] glow-pulse"
        style={{ background: "var(--gradient-card-a)" }}
      >
        {pct}%
      </div>
      <h2 className="mt-6 text-2xl font-bold">Run complete</h2>
      <p
        className="mt-2 text-xs uppercase tracking-widest text-muted-foreground"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {score} / {total} correct
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-[color:var(--primary-foreground)] glow-primary transition active:scale-[0.99]"
          style={{ background: "var(--primary)" }}
        >
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
        <Link
          to="/subject/$subjectId"
          params={{ subjectId: backTo }}
          className="rounded-2xl border border-border bg-card py-3 text-sm font-semibold backdrop-blur transition hover:border-[color:var(--ring)]"
        >
          Choose another topic
        </Link>
      </div>
    </motion.div>
  );
}
