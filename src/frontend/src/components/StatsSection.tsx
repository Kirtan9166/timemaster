import { motion, useInView } from "motion/react";
import { useRef } from "react";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  {
    value: 10000,
    suffix: "+",
    label: "Hours Analyzed",
    icon: "⏱",
    color: "gold",
  },
  {
    value: 5,
    suffix: "",
    label: "Proven Principles",
    icon: "⚡",
    color: "blue",
  },
  {
    value: 3,
    suffix: "",
    label: "Free Tools",
    icon: "🛠",
    color: "gold",
  },
  {
    value: "∞",
    suffix: "",
    label: "Your Potential",
    icon: "🚀",
    color: "blue",
  },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.82 0.18 85 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <p className="section-label">Impact by the Numbers</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight">
            <span style={{ color: "oklch(0.58 0.02 240)" }}>Built on</span>{" "}
            <span className="neon-text-gold">real results</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="glass-card rounded-2xl p-6 md:p-8 text-center relative overflow-hidden group cursor-default"
                style={{
                  border:
                    stat.color === "gold"
                      ? "1px solid oklch(0.82 0.18 85 / 0.28)"
                      : "1px solid oklch(0.68 0.22 230 / 0.28)",
                  boxShadow:
                    stat.color === "gold"
                      ? "0 0 24px oklch(0.82 0.18 85 / 0.07), 0 12px 40px oklch(0.04 0.01 260 / 0.65)"
                      : "0 0 24px oklch(0.68 0.22 230 / 0.07), 0 12px 40px oklch(0.04 0.01 260 / 0.65)",
                  transition:
                    "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-4px) scale(1.02)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    stat.color === "gold"
                      ? "0 0 40px oklch(0.82 0.18 85 / 0.2), 0 20px 60px oklch(0.04 0.01 260 / 0.7)"
                      : "0 0 40px oklch(0.68 0.22 230 / 0.2), 0 20px 60px oklch(0.04 0.01 260 / 0.7)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    stat.color === "gold"
                      ? "0 0 24px oklch(0.82 0.18 85 / 0.07), 0 12px 40px oklch(0.04 0.01 260 / 0.65)"
                      : "0 0 24px oklch(0.68 0.22 230 / 0.07), 0 12px 40px oklch(0.04 0.01 260 / 0.65)";
                }}
              >
                {/* Ambient glow at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      stat.color === "gold"
                        ? "linear-gradient(90deg, transparent, oklch(0.88 0.2 85 / 0.6), transparent)"
                        : "linear-gradient(90deg, transparent, oklch(0.78 0.2 230 / 0.6), transparent)",
                  }}
                />

                <div className="relative z-10">
                  <div className="text-2xl mb-4">{stat.icon}</div>
                  <div
                    className={`text-5xl md:text-6xl font-black font-display mb-2 tracking-tight leading-none ${
                      stat.color === "gold"
                        ? "neon-text-gold"
                        : "neon-text-blue"
                    }`}
                  >
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      duration={2.5}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-body font-semibold tracking-widest uppercase mt-3">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
