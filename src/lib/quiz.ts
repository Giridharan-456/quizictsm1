import { SUBJECTS, getSubjectMeta } from "./subjects-meta";

export type AnswerKey = "A" | "B" | "C" | "D";

export type Question = {
  id: string;
  question: string;
  options: { key: AnswerKey; text: string }[];
  answer: AnswerKey;
};

/** Raw question shape as stored in the JSON data files. */
type RawQuestion = {
  question?: unknown;
  option_a?: unknown;
  option_b?: unknown;
  option_c?: unknown;
  option_d?: unknown;
  answer?: unknown;
};

/**
 * Each subject's JSON is one of:
 *   { "Topic Name": RawQuestion[] }                       (employability_skills)
 *   { "Topic Name": { questions: RawQuestion[] } }        (ictsm_theory)
 * We normalize both shapes in `extractQuestionArray`.
 */
type TopicValue = RawQuestion[] | { questions?: RawQuestion[] } | unknown;
type SubjectData = Record<string, TopicValue>;

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
const loaders: Record<string, () => Promise<SubjectData>> = {
  "ictsm-theory": () =>
    import("@/data/ictsm_theory.json").then(
      (m) => (m.default ?? (m as unknown)) as SubjectData,
    ),
  "employability-skills": () =>
    import("@/data/employability_skills.json").then(
      (m) => (m.default ?? (m as unknown)) as SubjectData,
    ),
};

const cache = new Map<string, Question[]>();

function isValidOption(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const t = v.trim();
  if (!t) return false;
  // Reject single punctuation-only fragments like "," "." "?" from broken parsing.
  if (t.length <= 1 && !/[a-z0-9]/i.test(t)) return false;
  return true;
}

function isAnswerKey(v: unknown): v is AnswerKey {
  return v === "A" || v === "B" || v === "C" || v === "D";
}

/** Normalize a topic value (array OR { questions: [...] }) into a RawQuestion[]. */
function extractQuestionArray(value: TopicValue): RawQuestion[] {
  if (Array.isArray(value)) return value as RawQuestion[];
  if (value && typeof value === "object") {
    const inner = (value as { questions?: unknown }).questions;
    if (Array.isArray(inner)) return inner as RawQuestion[];
  }
  return [];
}

/**
 * Convert a raw topic payload into validated `Question`s.
 * Accepts either a direct array or an object with a `questions` array.
 */
function toQuestions(raw: TopicValue, topicSlug: string): Question[] {
  const list = extractQuestionArray(raw);
  const out: Question[] = [];
  let dropped = 0;

  list.forEach((q, i) => {
    if (!q || typeof q !== "object") {
      dropped++;
      return;
    }

    const opts = [q.option_a, q.option_b, q.option_c, q.option_d];
    if (!opts.every(isValidOption)) {
      dropped++;
      return;
    }

    // Drop questions where all options are identical (corrupt rows).
    const uniq = new Set(opts.map((o) => o.trim().toLowerCase()));
    if (uniq.size < 2) {
      dropped++;
      return;
    }

    if (typeof q.question !== "string" || !q.question.trim()) {
      dropped++;
      return;
    }

    // Normalize answer key — fall back to "A" if invalid/missing.
    const rawAnswer =
      typeof q.answer === "string" ? q.answer.trim().toUpperCase() : "";
    const answer: AnswerKey = isAnswerKey(rawAnswer) ? rawAnswer : "A";

    out.push({
      id: `${topicSlug}-${i}`,
      question: q.question,
      options: [
        { key: "A", text: opts[0] },
        { key: "B", text: opts[1] },
        { key: "C", text: opts[2] },
        { key: "D", text: opts[3] },
      ],
      answer,
    });
  });

  if (dropped > 0) {
    console.warn(
      `[quiz] "${topicSlug}": filtered ${dropped} invalid question(s) out of ${list.length}.`,
    );
  }

  return out;
}

/**
 * Runtime cache of validated counts per subject/topic, populated as topics load.
 * The UI can call `getValidatedCount` to reflect post-filter numbers without
 * altering the static meta shape.
 */
const countCache = new Map<string, number>();

/** Validated question count for a loaded topic, or null if not loaded yet. */
export function getValidatedCount(
  subjectId: string,
  topicId: string,
): number | null {
  const v = countCache.get(`${subjectId}:${topicId}`);
  return typeof v === "number" ? v : null;
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

  const loader = loaders[subjectId];
  if (!loader) return null;

  let raw: SubjectData;
  try {
    raw = await loader();
  } catch (err) {
    // Network/parse failure — return empty so the UI can show a graceful state.
    console.error(`[quiz] failed to load subject "${subjectId}":`, err);
    return { name: topicId, questions: [] };
  }

  let name = "";
  let questions: Question[] = [];

  try {
    if (topicId === "all") {
      name = "All Topics Shuffled";
      questions = shuffle(
        Object.entries(raw).flatMap(([t, value]) =>
          toQuestions(value, slug(t)),
        ),
      );
    } else {
      const entry = Object.entries(raw).find(([n]) => slug(n) === topicId);
      if (!entry) return null;
      name = entry[0].trim();
      questions = toQuestions(entry[1], topicId);
    }
  } catch (err) {
    console.error(
      `[quiz] failed to parse topic "${topicId}" of subject "${subjectId}":`,
      err,
    );
    return { name: name || topicId, questions: [] };
  }

  cache.set(cacheKey, questions);
  return { name, questions };
}

export { SUBJECTS as subjects, getSubjectMeta as getSubject };
