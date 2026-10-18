import { useState } from "react";
import type { Question } from "@/lib/questions";

const TONE_COUNT = 5;

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
  const tone = index % TONE_COUNT;

  return (
    <button
      type="button"
      aria-label={`${question.question} — retourner la carte`}
      aria-pressed={flipped}
      onClick={() => {
        setFlipped((f) => !f);
        onFlip();
      }}
      className={`perspective press aspect-[3/4] cursor-pointer select-none ${flipped ? "flipped" : ""}`}
    >
      <div className="flip-inner relative size-full">
        <div className={`flashcard-face flashcard-front flip-face absolute inset-0 rounded-3xl p-2 `}>
          <span className="font-display text-xl leading-tight sm:text-3xl md:text-4xl">
            {question.question}
          </span>
        </div>
        <div className={`flashcard-face flashcard-answer tone-${tone} flip-face flip-back absolute inset-0 rounded-3xl p-2`}>
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
