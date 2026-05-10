import ictsmRaw from "@/data/ictsm_theory.json";
import empRaw from "@/data/employability_skills.json";

export type Question = {
  id: string;
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  answer: "A" | "B" | "C" | "D";
  notes?: string;
};

export type Topic = {
  id: string;
  name: string;
  questions: Question[];
};

export type Subject = {
  id: string;
  name: string;
  description: string;
  gradient: string;
  topics: Topic[];
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function build(
  raw: Record<string, any[]>,
  subjectId: string,
  name: string,
  description: string,
  gradient: string,
): Subject {
  const topics: Topic[] = Object.entries(raw).map(([topicName, qs]) => ({
    id: slug(topicName),
    name: topicName.trim(),
    questions: qs.map((q, i) => ({
      id: `${slug(topicName)}-${i}`,
      question: q.question,
      options: [
        { key: "A", text: q.option_a },
        { key: "B", text: q.option_b },
        { key: "C", text: q.option_c },
        { key: "D", text: q.option_d },
      ],
      answer: (q.answer || "A").trim().toUpperCase() as "A",
      notes: q.notes,
    })),
  }));
  return { id: subjectId, name, description, gradient, topics };
}

export const subjects: Subject[] = [
  build(
    ictsmRaw as any,
    "ictsm-theory",
    "ICTSM Theory",
    "ITI ICTSM 2nd Year",
    "var(--gradient-ictsm)",
  ),
  build(
    empRaw as any,
    "employability-skills",
    "Employability Skills",
    "2nd Year",
    "var(--gradient-emp)",
  ),
];

export const getSubject = (id: string) => subjects.find((s) => s.id === id);

export const getTopic = (subjectId: string, topicId: string) => {
  const s = getSubject(subjectId);
  if (!s) return undefined;
  if (topicId === "all") {
    const all = s.topics.flatMap((t) => t.questions);
    return { id: "all", name: "All Topics Shuffled", questions: shuffle(all) };
  }
  return s.topics.find((t) => t.id === topicId);
};

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
