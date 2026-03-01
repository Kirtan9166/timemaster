import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type TimeOfDay = "Morning" | "Afternoon" | "Evening" | "Night";
type EnergyLevel = "High" | "Medium" | "Low";
type Challenge =
  | "Procrastination"
  | "Distraction"
  | "Overwhelm"
  | "Lack of Focus";

const suggestions: Record<string, string> = {
  "Morning-High-Procrastination":
    "Start with your 3 Most Important Tasks (MITs) right now. Morning energy is gold — do the hardest thing first (Eat the Frog method).",
  "Morning-High-Distraction":
    "Use the 90-minute Deep Work block. Phone off. One tab only. You have peak energy — protect it.",
  "Morning-High-Overwhelm":
    "Brain dump everything on paper. Then pick just ONE thing. The rest can wait.",
  "Morning-High-Lack of Focus":
    "Try the Pomodoro: 25min work, 5min break. Start the timer NOW.",
  "Morning-Medium-Procrastination":
    "2-Minute Rule: If a task takes under 2 minutes, do it immediately. Build momentum.",
  "Morning-Medium-Distraction":
    "Put your phone in another room for 1 hour. Use full-screen mode. You've got this.",
  "Morning-Medium-Overwhelm":
    "Pick just ONE task. Write it on paper. Work only on that for 45 minutes.",
  "Morning-Medium-Lack of Focus":
    "Try binaural beats + 25min Pomodoro. Ease into focus with a quick brain warm-up.",
  "Morning-Low-Procrastination":
    "Low energy is real. Do small, easy wins first to build momentum. Coffee + 10min walk helps.",
  "Morning-Low-Distraction":
    "Low energy + distractions = productivity death. Schedule this for later. Rest now.",
  "Morning-Low-Overwhelm":
    "You're overwhelmed AND tired. That's a signal. Rest 20min, then pick one micro-task.",
  "Morning-Low-Lack of Focus":
    "Don't fight your biology. Do admin tasks, emails, or light work. Save deep work for after lunch.",
  "Afternoon-High-Procrastination":
    "Afternoon energy peak! Use it NOW. Set a 50-minute timer and eliminate all notifications.",
  "Afternoon-High-Distraction":
    "Great energy, but distractions drain it fast. Use website blockers for 90 minutes.",
  "Afternoon-High-Overwhelm":
    "List your top 3 tasks. Do ONLY task #1 until it's done. Then celebrate.",
  "Afternoon-High-Lack of Focus":
    "Walk outside for 5 minutes to reset. Then use the 2-minute startup ritual before working.",
  "Afternoon-Medium-Procrastination":
    "Pair a boring task with something enjoyable. Work-music combo = 40% more output.",
  "Afternoon-Medium-Distraction":
    "Schedule specific 'distraction windows' every 90 minutes. Work intensely between them.",
  "Afternoon-Medium-Overwhelm":
    "Write down every stressor. Categorize: urgent vs important vs neither. Drop the neither.",
  "Afternoon-Medium-Lack of Focus":
    "The 5-Second Rule: count 5-4-3-2-1 and start. Your brain shifts from resist to action mode.",
  "Afternoon-Low-Procrastination":
    "Classic afternoon slump. Short 10-min walk + cold water. Don't force deep work.",
  "Afternoon-Low-Distraction":
    "Low energy makes you vulnerable to distraction. Block social media for 1 hour.",
  "Afternoon-Low-Overwhelm":
    "Overwhelm + fatigue = shutdown. Take 15min break. Come back with ONE clear next action.",
  "Afternoon-Low-Lack of Focus":
    "Your ultradian rhythm is at low point. Do meetings, calls, or filing. Save focus work for later.",
  "Evening-High-Procrastination":
    "Evening energy? Rare gift! Use it for creative work, writing, or side projects.",
  "Evening-High-Distraction":
    "Evening distractions usually come from wanting to relax. Schedule downtime AFTER a 60-min sprint.",
  "Evening-High-Overwhelm":
    "Evening overwhelm is often tomorrow's anxiety. Write tomorrow's plan now. Brain dump. Sleep better.",
  "Evening-High-Lack of Focus":
    "Review today's wins — even tiny ones. Then plan 3 things for tomorrow. Close your mental loops.",
  "Evening-Medium-Procrastination":
    "Review what you accomplished today. Plan tomorrow's top 3 tasks. Wind down intentionally.",
  "Evening-Medium-Distraction":
    "Reward yourself for today's work. Evening is for recharging. Light entertainment is fine.",
  "Evening-Medium-Overwhelm":
    "Journal your thoughts for 10 minutes. Write down what's worrying you. Then close the notebook.",
  "Evening-Medium-Lack of Focus":
    "Wind down with a digital sunset — no work screens after 8pm. Your brain needs recovery time.",
  "Evening-Low-Procrastination":
    "Don't push yourself. Low evening energy is your body saying it's recovery time. Honor it.",
  "Evening-Low-Distraction":
    "Watching endless content at night? Set a hard phone curfew at 9pm for better sleep.",
  "Evening-Low-Overwhelm":
    "You need rest, not more tasks. Write 3 things you're grateful for and sleep.",
  "Evening-Low-Lack of Focus":
    "Evening tiredness is normal. Do your evening ritual, prepare for tomorrow, and sleep on time.",
  "Night-High-Procrastination":
    "Night owl? Be strategic. Do creative deep work if you must, but respect your natural rhythm.",
  "Night-High-Distraction":
    "Night distractions are the sneakiest. Set a 1-hour work sprint timer, then mandatory sleep.",
  "Night-High-Overwhelm":
    "Late-night overwhelm is often anxiety, not real tasks. Write it down, then sleep. It'll be clearer tomorrow.",
  "Night-High-Lack of Focus":
    "Blue light from screens blocks melatonin. Night productivity rarely equals morning output.",
  "Night-Medium-Procrastination":
    "Protect your sleep — it's when your brain consolidates learning. No screens 30min before bed.",
  "Night-Medium-Distraction":
    "Scrolling at night? Set your phone to grayscale mode. It kills the dopamine hit fast.",
  "Night-Medium-Overwhelm":
    "Write down your biggest worry. Then ask: 'Can I solve this at night?' Usually no. Sleep.",
  "Night-Medium-Lack of Focus":
    "Your prefrontal cortex is shutting down. That's biology, not weakness. Sleep wins.",
  "Night-Low-Procrastination":
    "You're running on empty. Rest is productive. Tomorrow's version of you will be sharper.",
  "Night-Low-Distraction":
    "Endless scrolling at night destroys tomorrow's productivity. Charge phone outside bedroom.",
  "Night-Low-Overwhelm":
    "The night magnifies anxiety. Write: 'I will handle this tomorrow at [time].' Then sleep.",
  "Night-Low-Lack of Focus":
    "Night + low energy + no focus = sleep deprivation spiral. Protect your sleep like it's gold.",
};

const timeOptions: TimeOfDay[] = ["Morning", "Afternoon", "Evening", "Night"];
const energyOptions: EnergyLevel[] = ["High", "Medium", "Low"];
const challengeOptions: Challenge[] = [
  "Procrastination",
  "Distraction",
  "Overwhelm",
  "Lack of Focus",
];

function getSuggestion(
  time: TimeOfDay,
  energy: EnergyLevel,
  challenge: Challenge,
): string {
  const key = `${time}-${energy}-${challenge}`;
  if (suggestions[key]) return suggestions[key];

  // Time-based fallbacks
  const fallbacks: Record<TimeOfDay, string> = {
    Morning:
      "Morning is your power window. Block 2-3 hours for deep work before checking messages.",
    Afternoon:
      "Afternoon slump is real. Take a 10-min walk, then tackle medium-priority tasks.",
    Evening:
      "Review what you accomplished today. Plan tomorrow's top 3 tasks. Wind down intentionally.",
    Night:
      "Protect your sleep — it's when your brain consolidates learning. No screens 30min before bed.",
  };

  return fallbacks[time];
}

type Step = "time" | "energy" | "challenge" | "result";

export default function AIProductivityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("time");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  function handleReset() {
    setStep("time");
    setTimeOfDay(null);
    setEnergyLevel(null);
    setChallenge(null);
    setSuggestion(null);
  }

  function handleSelectTime(t: TimeOfDay) {
    setTimeOfDay(t);
    setStep("energy");
  }

  function handleSelectEnergy(e: EnergyLevel) {
    setEnergyLevel(e);
    setStep("challenge");
  }

  function handleSelectChallenge(c: Challenge) {
    setChallenge(c);
    const tip = getSuggestion(timeOfDay!, energyLevel!, c);
    setSuggestion(tip);
    setStep("result");
  }

  const stepConfig = {
    time: {
      question: "What time is it for you?",
      options: timeOptions,
      onSelect: handleSelectTime,
      icon: "🕐",
    },
    energy: {
      question: "How's your energy right now?",
      options: energyOptions,
      onSelect: handleSelectEnergy,
      icon: "⚡",
    },
    challenge: {
      question: "Your main challenge today?",
      options: challengeOptions,
      onSelect: handleSelectChallenge,
      icon: "🎯",
    },
  };

  const stepNumbers: Record<Step, number> = {
    time: 1,
    energy: 2,
    challenge: 3,
    result: 3,
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {/* Widget panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card rounded-2xl p-5 w-80"
            style={{
              border: "1px solid oklch(0.68 0.22 230 / 0.3)",
              boxShadow:
                "0 0 24px oklch(0.68 0.22 230 / 0.12), 0 8px 32px oklch(0.05 0.01 260 / 0.6)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <div>
                  <p
                    className="text-sm font-bold font-display"
                    style={{ color: "oklch(0.78 0.2 230)" }}
                  >
                    AI Productivity Coach
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    Personalized tip in 3 steps
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Step indicator */}
            {step !== "result" && (
              <div className="flex items-center gap-1.5 mb-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background:
                        n <= stepNumbers[step]
                          ? "oklch(0.68 0.22 230)"
                          : "oklch(0.25 0.04 255)",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Step content */}
            <AnimatePresence mode="wait">
              {step !== "result" ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-semibold font-body text-foreground mb-3 flex items-center gap-2">
                    <span>
                      {stepConfig[step as Exclude<Step, "result">].icon}
                    </span>
                    {stepConfig[step as Exclude<Step, "result">].question}
                  </p>
                  <div className="flex flex-col gap-2">
                    {(
                      stepConfig[step as Exclude<Step, "result">]
                        .options as string[]
                    ).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          (
                            stepConfig[step as Exclude<Step, "result">]
                              .onSelect as (v: string) => void
                          )(option)
                        }
                        className="text-left px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 neon-btn-blue"
                        style={{ justifyContent: "flex-start" }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Summary chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {[timeOfDay, energyLevel, challenge].map(
                      (val) =>
                        val && (
                          <span
                            key={val}
                            className="text-xs font-body px-2 py-0.5 rounded-full"
                            style={{
                              background: "oklch(0.68 0.22 230 / 0.15)",
                              border: "1px solid oklch(0.68 0.22 230 / 0.3)",
                              color: "oklch(0.78 0.2 230)",
                            }}
                          >
                            {val}
                          </span>
                        ),
                    )}
                  </div>

                  {/* Suggestion box */}
                  <div
                    className="rounded-xl p-4 mb-4"
                    style={{
                      background:
                        "radial-gradient(ellipse 100% 60% at 50% 0%, oklch(0.82 0.18 85 / 0.06) 0%, transparent 70%), oklch(0.13 0.02 260 / 0.6)",
                      border: "1px solid oklch(0.82 0.18 85 / 0.2)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold font-display tracking-wider uppercase mb-2"
                      style={{ color: "oklch(0.82 0.18 85)" }}
                    >
                      ✨ Your Personalized Tip
                    </p>
                    <p className="text-sm font-body text-foreground/90 leading-relaxed">
                      {suggestion}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="neon-btn-gold rounded-xl px-4 py-2 text-sm font-semibold font-display flex-1"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="neon-btn-blue rounded-xl px-4 py-2 text-sm font-semibold font-display"
                    >
                      Got it ✓
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating brain button */}
      <motion.button
        type="button"
        onClick={() => {
          setIsOpen((v) => !v);
          if (!isOpen) handleReset();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
        style={{
          background: isOpen
            ? "oklch(0.68 0.22 230 / 0.25)"
            : "oklch(0.13 0.022 262 / 0.85)",
          border: "1px solid oklch(0.68 0.22 230 / 0.5)",
          boxShadow:
            "0 0 20px oklch(0.68 0.22 230 / 0.25), 0 4px 16px oklch(0.05 0.01 260 / 0.5)",
          backdropFilter: "blur(20px)",
        }}
        aria-label="Open AI Productivity Coach"
        title="AI Productivity Coach"
      >
        🧠
      </motion.button>
    </div>
  );
}
