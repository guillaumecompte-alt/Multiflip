/**
 * Question generation logic — fully independent from the UI.
 *
 * To add a new question type: write a Generator and register it in GENERATORS.
 */

export type QuestionType = "type1" | "type2" | "type3";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  answer: string;
}

export const AVAILABLE_TABLES = [3, 4, 5, 6, 7, 8, 9] as const;

export const QUESTION_TYPES: { id: QuestionType; label: string; example: string }[] = [
  { id: "type1", label: "Multiplication classique", example: "6 × 7 = ?" },
  { id: "type2", label: "Facteur manquant", example: "8 × ? = 56" },
  { id: "type3", label: "Décomposition", example: "24 = ? × ?" },
];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** All valid (a, b) pairs where both factors come from the selected tables. */
function pairs(tables: number[]): [number, number][] {
  const out: [number, number][] = [];
  for (const a of tables) for (const b of tables) out.push([a, b]);
  return out;
}

interface Generator {
  /** Returns every distinct question this type can produce for the given tables. */
  all(tables: number[]): Question[];
}

const type1: Generator = {
  all: (tables) =>
    pairs(tables).map(([a, b]) => ({
      id: `type1-${a}x${b}`,
      type: "type1",
      question: `${a} × ${b} = ?`,
      answer: String(a * b),
    })),
};

const type2: Generator = {
  all: (tables) =>
    pairs(tables).map(([a, b]) => ({
      id: `type2-${a}x${b}`,
      type: "type2",
      question: `${a} × ? = ${a * b}`,
      answer: String(b),
    })),
};

const type3: Generator = {
  all: (tables) => {
    const solutions = new Map<number, [number, number][]>();
    const seenSolutions = new Map<number, Set<string>>();
    for (const [a, b] of pairs(tables)) {
      const p = a * b;
      const canonical: [number, number] = a <= b ? [a, b] : [b, a];
      const key = canonical.join("x");
      const seen = seenSolutions.get(p) ?? new Set<string>();
      if (seen.has(key)) continue;

      const list = solutions.get(p) ?? [];
      list.push(canonical);
      solutions.set(p, list);
      seen.add(key);
      seenSolutions.set(p, seen);
    }
    return [...solutions.entries()].map(([product, sols]) => {
      return {
        id: `type3-${product}`,
        type: "type3" as const,
        question: `${product} = ? × ?`,
        answer: sols.map(([a, b]) => `${a} × ${b}`).join(" ou "),
      };
    });
  },
};

const GENERATORS: Record<QuestionType, Generator> = { type1, type2, type3 };

export const CARD_COUNT = 9;

/** Splits CARD_COUNT as evenly as possible; the extra cards go to random types. */
export function distribute(types: QuestionType[], total = CARD_COUNT): Map<QuestionType, number> {
  const counts = new Map<QuestionType, number>(types.map((t) => [t, Math.floor(total / types.length)]));
  const leftovers = shuffle(types).slice(0, total % types.length);
  for (const t of leftovers) counts.set(t, (counts.get(t) ?? 0) + 1);
  return counts;
}

/** Builds a shuffled series of 9 questions, avoiding exact duplicates. */
export function generateSeries(tables: number[], types: QuestionType[], total = CARD_COUNT): Question[] {
  if (tables.length === 0 || types.length === 0) return [];

  const counts = distribute(types, total);
  const series: Question[] = [];

  for (const [type, count] of counts) {
    const pool = shuffle(GENERATORS[type].all(tables));
    for (let i = 0; i < count; i++) {
      // Reuse the pool cyclically when it is smaller than the requested count.
      const q = pool[i % pool.length]!;
      series.push({ ...q, id: `${q.id}-${i}` });
    }
  }

  return shuffle(series);
}
