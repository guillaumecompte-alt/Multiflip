import { useState } from "react";
import type { Question } from "@/lib/questions";

const PALETTE = [
  { back: "bg-brand text-white", shadow: "shadow-[0_18px_40px_-18px_rgba(108,92,231,0.5)]" },
  { back: "bg-sky-deep text-white", shadow: "shadow-[0_18px_40px_-18px_rgba(2,132,199,0.5)]" },
  { back: "bg-accent-deep text-white", shadow: "shadow-[0_18px_40px_-18px_rgba(225,29,72,0.5)]" },
  { back: "bg-mint-deep text-white", shadow: "shadow-[0_18px_40px_-18px_rgba(5,150,105,0.5)]" },
  { back: "bg-sun text-ink", shadow: "shadow-[0_18px_40px_-18px_rgba(251,191,36,0.5)]" },
];

export function Flashcard({
  question,
  index,
  onFlip,
}: {
  question: Question;
  index: number;
  onFlip: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const tone = PALETTE[index % PALETTE.length]!;

  return (
    <button
      type="button"
      aria-label={`${question.question} — retourner la carte`}
      onClick={() => {
        setFlipped((f) => !f);
        onFlip();
      }}
      className={`perspective press aspect-[3/4] cursor-pointer select-none ${flipped ? "flipped" : ""}`}
    >
      <div className="flip-inner relative size-full">
        <div
          className={`flip-face absolute inset-0 grid place-items-center rounded-3xl border border-white/70 bg-white/75 p-2 backdrop-blur-xl ${tone.shadow}`}
        >
          <span className="font-display text-xl leading-tight sm:text-3xl md:text-4xl">
            {question.question}
          </span>
        </div>
        <div
          className={`flip-face flip-back absolute inset-0 grid place-items-center rounded-3xl p-2 ${tone.back} ${tone.shadow}`}
        >
          <span
            className={`font-display font-bold leading-tight ${
              question.type === "type3" ? "text-lg sm:text-3xl md:text-4xl" : "text-3xl sm:text-5xl md:text-6xl"
            }`}
          >
            {question.answer}
          </span>
        </div>
      </div>
    </button>
  );
}
