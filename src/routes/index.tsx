import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { Flashcard } from "@/components/Flashcard";
import { playClick } from "@/lib/click-sound";
import {
  AVAILABLE_TABLES,
  QUESTION_TYPES,
  generateSeries,
  type Question,
  type QuestionType,
} from "@/lib/questions";

const TITLE = "Multipo — révise tes tables de multiplication";
const DESCRIPTION =
  "Flashcards interactives pour réviser les tables de 3 à 9 : multiplications, facteur manquant et décompositions. Pour les 8-12 ans.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Screen = "home" | "setup" | "play";

function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tables, setTables] = useState<number[]>([...AVAILABLE_TABLES]);
  const [types, setTypes] = useState<QuestionType[]>(["type1"]);
  const [soundOn, setSoundOn] = useState(true);
  const [series, setSeries] = useState<Question[]>([]);
  const [seriesKey, setSeriesKey] = useState(0);

  const canStart = tables.length > 0 && types.length > 0;

  const newSeries = useCallback(() => {
    setSeries(generateSeries(tables, types));
    setSeriesKey((k) => k + 1);
  }, [tables, types]);

  const onFlip = useCallback(() => {
    if (soundOn) playClick();
  }, [soundOn]);

  const tablesLabel = useMemo(() => [...tables].sort((a, b) => a - b).join(" · "), [tables]);

  const toggleTable = (n: number) =>
    setTables((prev) => (prev.includes(n) ? prev.filter((t) => t !== n) : [...prev, n]));

  const toggleType = (t: QuestionType) =>
    setTypes((prev) => {
      if (prev.includes(t)) return prev.length === 1 ? prev : prev.filter((x) => x !== t);
      return [...prev, t];
    });

  return (
    <div className="app-bg font-body relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-sky/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 size-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 size-96 rounded-full bg-mint/20 blur-3xl" />
      <div className="pointer-events-none absolute top-10 left-1/2 size-72 rounded-full bg-sun/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="brand-mark grid size-11 place-items-center rounded-2xl text-2xl shadow-lg backdrop-blur-xl">
              ✕
            </div>
            <div>
              <h1 className="brand-title font-display text-xl leading-none font-semibold">Multipo</h1>
              <p className="brand-tagline text-xs font-bold tracking-wide">révise tes tables, en mode jeu</p>
            </div>
          </div>
          {screen === "play" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScreen("setup")}
                className="header-control h-10 rounded-xl px-4 text-sm font-bold shadow-sm backdrop-blur-xl transition"
              >
                Réglages
              </button>
              <button
                onClick={() => setSoundOn((s) => !s)}
                title={soundOn ? "Couper le son" : "Activer le son"}
                aria-label={soundOn ? "Couper le son" : "Activer le son"}
                className="header-control grid h-10 w-10 place-items-center rounded-xl text-lg shadow-sm backdrop-blur-xl"
              >
                {soundOn ? "🔊" : "🔇"}
              </button>
            </div>
          )}
        </header>

        {screen === "home" && (
          <section className="settings-panel rounded-[28px] p-6 backdrop-blur-2xl sm:p-10">
            <div className="mx-auto max-w-xl text-center">
              <div className="floaty mx-auto grid size-32 place-items-center">
                <div className="absolute size-24 -rotate-12 rounded-3xl bg-accent/80 shadow-lg" />
                <div className="absolute size-24 rotate-12 rounded-3xl bg-sky/80 shadow-lg" />
                <div className="relative grid size-24 place-items-center rounded-3xl bg-brand shadow-xl shadow-brand/30">
                  <span className="font-display text-4xl font-bold text-white">×</span>
                </div>
              </div>
              <h2 className="hero-heading font-display mt-8 text-4xl font-semibold text-balance sm:text-5xl">
                Retourne les cartes, mémorise tes tables.
              </h2>
              <p className="hero-caption mt-3 text-pretty">
                9 cartes, 3 types de questions, autant de séries que tu veux.
              </p>
              <button
                onClick={() => setScreen("setup")}
                className="primary-action font-display mt-8 h-14 w-full rounded-2xl px-7 text-lg font-semibold transition hover:-translate-y-0.5 sm:w-auto"
              >
                Commencer
              </button>
            </div>
          </section>
        )}

        {screen === "setup" && (
          <section className="settings-panel mb-8 rounded-[28px] p-5 backdrop-blur-2xl sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="lg:w-1/2">
                <p className="section-eyebrow mb-3 text-xs font-black tracking-[0.2em] uppercase">Tables à réviser</p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TABLES.map((n) => {
                    const on = tables.includes(n);
                    return (
                      <button
                        key={n}
                        onClick={() => toggleTable(n)}
                        aria-pressed={on}
                        className={`table-toggle font-display h-11 w-11 rounded-2xl text-lg font-semibold transition ${on ? "is-selected" : ""}`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setTables([...AVAILABLE_TABLES])}
                    className="muted-action text-xs font-bold transition"
                  >
                    Tout sélectionner
                  </button>
                  <span className="separator-dot">·</span>
                  <button
                    onClick={() => setTables([])}
                    className="text-xs font-bold text-ink/65 transition hover:text-brand"
                  >
                    Tout désélectionner
                  </button>
                </div>
              </div>

              <div className="lg:w-1/2">
                <p className="section-eyebrow mb-3 text-xs font-black tracking-[0.2em] uppercase">Types de questions</p>
                <div className="grid gap-2">
                  {QUESTION_TYPES.map((t, i) => {
                    const on = types.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleType(t.id)}
                        aria-pressed={on}
                        className={`question-type-toggle flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${on ? "is-selected" : ""}`}
                      >
                        <span
                          className={`question-number grid size-6 place-items-center rounded-lg text-xs font-black ${on ? "is-selected" : ""}`}
                        >
                          {i + 1}
                        </span>
                        <span className="question-type-label text-sm font-bold">{t.label}</span>
                        {on ? (
                          <span className="ml-auto text-brand">✓</span>
                        ) : (
                          <span className="question-type-indicator ml-auto size-4 rounded-md border-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                disabled={!canStart}
                onClick={() => {
                  newSeries();
                  setScreen("play");
                }}
                className="primary-action font-display h-13 rounded-2xl px-7 text-lg font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                style={{ height: "3.25rem" }}
              >
                Commencer la révision →
              </button>
            </div>
          </section>
        )}

        {screen === "play" && (
          <section className="relative">
            <div className="mb-4 flex items-center justify-between px-1">
              <p className="game-meta text-sm font-bold">Tables {tablesLabel} ✦ touche une carte</p>
              <button onClick={newSeries} className="text-sm font-bold text-brand hover:underline">
                Nouvelle série ↻
              </button>
            </div>

            <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2.5 sm:gap-4">
              {series.map((q, i) => (
                <Flashcard key={`${seriesKey}-${q.id}`} question={q} index={i} onFlip={onFlip} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
