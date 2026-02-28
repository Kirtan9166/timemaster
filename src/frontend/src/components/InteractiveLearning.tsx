import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";

type Challenge = "waste" | "distracted" | "focus" | null;

const challenges = [
  {
    id: "waste" as const,
    label: "I waste time",
    emoji: "⏳",
    btnClass: "neon-btn-orange",
    activeClass:
      "bg-[oklch(0.72_0.2_40/0.25)] border-[oklch(0.72_0.2_40/0.8)] shadow-[0_0_30px_oklch(0.72_0.2_40/0.3)]",
    dotColor: "bg-[oklch(0.82_0.2_40)]",
    titleColor: "text-[oklch(0.88_0.2_45)]",
    solutions: [
      {
        title: "Apply the 80/20 Rule",
        detail:
          "List every task, then identify the 20% that create 80% of your value. Delete or defer the rest.",
        icon: "⚡",
      },
      {
        title: "Conduct a Time Audit",
        detail:
          "Track every 30 minutes for 3 days. You'll discover surprising time leaks you didn't know existed.",
        icon: "🔍",
      },
      {
        title: "Eliminate Low-Value Tasks",
        detail:
          "Use STOP / DELEGATE / AUTOMATE for recurring tasks that don't move your main goals forward.",
        icon: "🗑️",
      },
    ],
  },
  {
    id: "distracted" as const,
    label: "I get distracted",
    emoji: "📵",
    btnClass: "neon-btn-yellow",
    activeClass:
      "bg-[oklch(0.88_0.18_90/0.15)] border-[oklch(0.88_0.18_90/0.8)] shadow-[0_0_30px_oklch(0.88_0.18_90/0.3)]",
    dotColor: "bg-[oklch(0.88_0.18_90)]",
    titleColor: "text-[oklch(0.92_0.18_90)]",
    solutions: [
      {
        title: "Create Phone-Free Zones",
        detail:
          "Designate specific times and spaces where your phone is physically absent. Your bedroom, deep work hours, and meals.",
        icon: "📵",
      },
      {
        title: "Use Website Blockers",
        detail:
          "Tools like Cold Turkey or Freedom block distracting sites during work sessions. Remove choice from the equation.",
        icon: "🛡️",
      },
      {
        title: "Schedule Distraction Time",
        detail:
          "Paradoxically, schedule 15-min 'distraction windows' twice a day. The compulsion weakens when it's planned.",
        icon: "📅",
      },
    ],
  },
  {
    id: "focus" as const,
    label: "I can't focus",
    emoji: "🎯",
    btnClass: "neon-btn-blue",
    activeClass:
      "bg-[oklch(0.62_0.2_240/0.2)] border-[oklch(0.62_0.2_240/0.8)] shadow-[0_0_30px_oklch(0.62_0.2_240/0.3)]",
    dotColor: "bg-[oklch(0.72_0.2_240)]",
    titleColor: "text-[oklch(0.78_0.2_240)]",
    solutions: [
      {
        title: "Use the Pomodoro Technique",
        detail:
          "25 minutes of pure focus, then a 5-minute break. Your brain works in natural focus cycles — align with them.",
        icon: "🍅",
      },
      {
        title: "Design Your Environment",
        detail:
          "Cold room (18°C), natural light, clear desk, ambient or no music. Your environment sets your mental state.",
        icon: "🏡",
      },
      {
        title: "Practice Single-Tasking",
        detail:
          "Multitasking reduces IQ by 15 points. Close all tabs, pick ONE task, and commit to it until done.",
        icon: "1️⃣",
      },
    ],
  },
];

export default function InteractiveLearning() {
  const [active, setActive] = useState<Challenge>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const activeChallenge = challenges.find((c) => c.id === active);

  return (
    <section
      id="interactive"
      className="relative py-24 px-4 section-glow-divider"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.78 0.18 195 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div ref={sectionRef} className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">Personalized Solutions</p>
          <h2 className="text-4xl md:text-5xl font-black font-display text-foreground mb-4">
            What's Your Biggest{" "}
            <span className="neon-text-cyan">Time Challenge?</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body">
            Click your challenge to unlock personalized strategies.
          </p>
        </motion.div>

        {/* Challenge buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {challenges.map((ch, i) => (
            <motion.button
              key={ch.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(active === ch.id ? null : ch.id)}
              className={`
                relative overflow-hidden rounded-2xl px-6 py-6 font-semibold text-lg font-display
                border transition-all duration-300 cursor-pointer
                ${active === ch.id ? ch.activeClass : ch.btnClass}
              `}
            >
              {/* Animated background glow on active */}
              {active === ch.id && (
                <motion.div
                  className="absolute inset-0 opacity-20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 2 }}
                  style={{
                    background:
                      "radial-gradient(circle, currentColor 0%, transparent 70%)",
                  }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-2">
                <span className="text-3xl">{ch.emoji}</span>
                <span>{ch.label}</span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Solution panel */}
        <AnimatePresence mode="wait">
          {activeChallenge && (
            <motion.div
              key={activeChallenge.id}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-2xl p-8 border border-[oklch(0.78_0.18_195/0.15)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{activeChallenge.emoji}</span>
                  <h3
                    className={`text-xl font-bold font-display ${activeChallenge.titleColor}`}
                  >
                    Solutions for "{activeChallenge.label}"
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeChallenge.solutions.map((sol, i) => (
                    <motion.div
                      key={sol.title}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.12,
                        ease: "easeOut",
                      }}
                      className="bg-[oklch(0.09_0.015_260/0.8)] rounded-xl p-5 border border-[oklch(0.25_0.04_255/0.5)]"
                    >
                      <div className="text-2xl mb-3">{sol.icon}</div>
                      <h4
                        className={`font-bold font-display mb-2 ${activeChallenge.titleColor}`}
                      >
                        {sol.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">
                        {sol.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
