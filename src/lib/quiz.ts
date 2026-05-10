import { SUBJECTS, getSubjectMeta } from "./subjects-meta";

export type Question = {
  id: string;
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  answer: "A" | "B" | "C" | "D";
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Vite dynamic-import: each subject becomes its own chunk, loaded only when a quiz starts.
const loaders: Record<string, () => Promise<Record<string, any[]>>> = {
  "ictsm-theory": () =>
    import("@/data/ictsm_theory.json").then((m) => m.default ?? (m as any)),
  "employability-skills": () =>
    import("@/data/employability_skills.json").then(
      (m) => m.default ?? (m as any),
    ),
};

const cache = new Map<string, Question[]>();

function toQuestions(raw: any[], topicSlug: string): Question[] {
  return raw.map((q, i) => ({
    id: `${topicSlug}-${i}`,
    question: q.question,
    options: [
      { key: "A", text: q.option_a },
      { key: "B", text: q.option_b },
      { key: "C", text: q.option_c },
      { key: "D", text: q.option_d },
    ],
    answer: (q.answer || "A").trim().toUpperCase() as "A",
  }));
}

export async function loadTopic(
  subjectId: string,
  topicId: string,
): Promise<{ name: string; questions: Question[] } | null> {
  const meta = getSubjectMeta(subjectId);
  if (!meta) return null;
  const cacheKey = `${subjectId}:${topicId}`;
  if (cache.has(cacheKey)) {
    return {
      name:
        topicId === "all"
          ? "All Topics Shuffled"
          : (meta.topics.find((t) => t.id === topicId)?.name ?? topicId),
      questions: cache.get(cacheKey)!,
    };
  }

  const raw = await loaders[subjectId]();
  let questions: Question[] = [];
  let name = "";

  if (topicId === "all") {
    name = "All Topics Shuffled";
    questions = shuffle(
      Object.entries(raw).flatMap(([t, qs]) => toQuestions(qs, slug(t))),
    );
  } else {
    const entry = Object.entries(raw).find(([n]) => slug(n) === topicId);
    if (!entry) return null;
    name = entry[0].trim();
    questions = toQuestions(entry[1], topicId);
  }

  cache.set(cacheKey, questions);
  return { name, questions };
}

export { SUBJECTS as subjects, getSubjectMeta as getSubject };
