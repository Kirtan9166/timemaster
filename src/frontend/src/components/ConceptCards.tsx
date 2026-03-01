import { motion, useInView } from "motion/react";
import { useRef } from "react";

const concepts = [
  {
    icon: "⚡",
    title: "Pareto Principle",
    subtitle: "80/20 Rule",
    description:
      "Focus on the 20% of tasks that generate 80% of your results. Most outcomes come from a small fraction of causes.",
    tip: "Audit your task list: which 3 items will move the needle most today?",
    color: "cyan",
    hue: "195",
  },
  {
    icon: "🧱",
    title: "Time Blocking",
    subtitle: "Protected Deep Work",
    description:
      "Schedule deep work in protected time blocks. Treat calendar blocks like meetings you cannot cancel.",
    tip: 'Block 2-hour "deep work" slots in the morning before checking messages.',
    color: "violet",
    hue: "280",
  },
  {
    icon: "🎯",
    title: "Goal Setting",
    subtitle: "Clarity Creates Motion",
    description:
      "Specific, measurable goals beat vague intentions every time. Clarity is the engine of execution.",
    tip: "Write goals as: 'I will [action] by [date] measured by [metric].'",
    color: "green",
    hue: "142",
  },
  {
    icon: "🚀",
    title: "Procrastination Control",
    subtitle: "Break the Inertia",
    description:
      "Break big tasks into 5-minute starting actions. Starting is always the hardest part — lower that bar.",
    tip: "Use the '2-minute rule': if it takes less than 2 minutes, do it now.",
    color: "orange",
    hue: "45",
  },
  {
    icon: "🧠",
    title: "Deep Work",
    subtitle: "Peak Cognitive Performance",
    description:
      "Eliminate distractions for peak cognitive performance. Deep focus is a superpower most people never cultivate.",
    tip: "One 90-minute phone-free session daily outperforms 4 hours of scattered work.",
    color: "violet",
    hue: "280",
  },
];

const colorMap: Record<
  string,
  { border: string; glow: string; text: string; bg: string; iconBg: string }
> = {
  cyan: {
    border: "border-[oklch(0.78_0.18_195/0.3)]",
    glow: "hover:shadow-[0_0_30px_oklch(0.78_0.18_195/0.2)]",
    text: "text-[oklch(0.78_0.18_195)]",
    bg: "bg-[oklch(0.78_0.18_195/0.08)]",
    iconBg: "bg-[oklch(0.78_0.18_195/0.12)]",
  },
  violet: {
    border: "border-[oklch(0.65_0.22_280/0.3)]",
    glow: "hover:shadow-[0_0_30px_oklch(0.65_0.22_280/0.2)]",
    text: "text-[oklch(0.72_0.22_280)]",
    bg: "bg-[oklch(0.65_0.22_280/0.08)]",
    iconBg: "bg-[oklch(0.65_0.22_280/0.12)]",
  },
  green: {
    border: "border-[oklch(0.82_0.18_142/0.3)]",
    glow: "hover:shadow-[0_0_30px_oklch(0.82_0.18_142/0.2)]",
    text: "text-[oklch(0.82_0.18_142)]",
    bg: "bg-[oklch(0.82_0.18_142/0.08)]",
    iconBg: "bg-[oklch(0.82_0.18_142/0.12)]",
  },
  orange: {
    border: "border-[oklch(0.75_0.2_45/0.3)]",
    glow: "hover:shadow-[0_0_30px_oklch(0.75_0.2_45/0.2)]",
    text: "text-[oklch(0.82_0.2_45)]",
    bg: "bg-[oklch(0.75_0.2_45/0.08)]",
    iconBg: "bg-[oklch(0.75_0.2_45/0.12)]",
  },
};

interface ConceptCardProps {
  concept: (typeof concepts)[0];
  index: number;
}

function ConceptCard({ concept, index }: ConceptCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const colors = colorMap[concept.color];
  const isLeft = index % 2 === 0;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`;
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -80 : 80, y: 20 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full ${index % 3 === 0 ? "float-anim-slow" : index % 3 === 1 ? "float-anim-delay" : "float-anim-slow"}`}
    >
      <div
        className={`glass-card rounded-2xl p-7 transition-all duration-300 cursor-default ${colors.glow}`}
        style={{
          transition: "transform 0.15s ease, box-shadow 0.3s ease",
          borderColor: "var(--card-accent-border, oklch(1 0 0 / 0.1))",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center text-2xl border ${colors.border} flex-shrink-0`}
          >
            {concept.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <h3 className={`text-xl font-bold font-display ${colors.text}`}>
                {concept.title}
              </h3>
              <span className="text-sm text-muted-foreground font-body">
                {concept.subtitle}
              </span>
            </div>

            <p className="text-foreground/75 font-body leading-relaxed mb-4">
              {concept.description}
            </p>

            {/* Tip */}
            <div
              className={`${colors.bg} rounded-lg px-4 py-3 border ${colors.border}`}
            >
              <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">
                Actionable Tip
              </p>
              <p className={`text-sm font-body ${colors.text}`}>
                {concept.tip}
              </p>
            </div>
          </div>

          {/* Number */}
          <div className="flex-shrink-0 hidden md:block">
            <span
              className={`text-6xl font-black font-display opacity-15 ${colors.text}`}
              style={{ lineHeight: 1 }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ConceptCards() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="concepts" className="relative py-24 px-4 section-glow-divider">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.65 0.22 280 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <p className="section-label">Core Principles</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-foreground mb-4 tracking-tight">
            Master the <span className="neon-text-blue">Science</span> of{" "}
            <span className="neon-text-gold">Time</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Five battle-tested principles used by the world's most productive
            people. Each one is simple. Together, they're transformative.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {concepts.map((concept, i) => (
            <ConceptCard key={concept.title} concept={concept} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
