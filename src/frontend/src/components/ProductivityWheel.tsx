import { Loader2 } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useSaveDailyStats } from "../hooks/useQueries";

interface TimeBlockData {
  name: string;
  hours: number;
  color: string;
  hexColor: string;
  isWaste: boolean;
}

const INITIAL_BLOCKS: TimeBlockData[] = [
  {
    name: "Sleep",
    hours: 8,
    color: "text-[oklch(0.55_0.12_240)]",
    hexColor: "#3b5bdb",
    isWaste: false,
  },
  {
    name: "Work",
    hours: 8,
    color: "text-[oklch(0.75_0.18_142)]",
    hexColor: "#2f9e44",
    isWaste: false,
  },
  {
    name: "Meals",
    hours: 2,
    color: "text-[oklch(0.78_0.18_50)]",
    hexColor: "#e67700",
    isWaste: false,
  },
  {
    name: "Commute",
    hours: 1,
    color: "text-[oklch(0.85_0.16_85)]",
    hexColor: "#f59f00",
    isWaste: false,
  },
  {
    name: "Exercise",
    hours: 1,
    color: "text-[oklch(0.78_0.18_195)]",
    hexColor: "#22b8cf",
    isWaste: false,
  },
  {
    name: "Entertainment",
    hours: 2,
    color: "text-[oklch(0.68_0.22_295)]",
    hexColor: "#9c36b5",
    isWaste: false,
  },
  {
    name: "Unplanned/Waste",
    hours: 2,
    color: "text-[oklch(0.65_0.22_25)]",
    hexColor: "#e03131",
    isWaste: true,
  },
];

const TOTAL_HOURS = 24;

function WheelSegment({
  startAngle,
  endAngle,
  color,
  innerRadius,
  outerRadius,
  label,
  hours,
  isActive,
}: {
  startAngle: number;
  endAngle: number;
  color: string;
  innerRadius: number;
  outerRadius: number;
  label: string;
  hours: number;
  isActive: boolean;
}) {
  const center = 160;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const x1 = center + outerRadius * Math.cos(toRad(startAngle));
  const y1 = center + outerRadius * Math.sin(toRad(startAngle));
  const x2 = center + outerRadius * Math.cos(toRad(endAngle));
  const y2 = center + outerRadius * Math.sin(toRad(endAngle));
  const x3 = center + innerRadius * Math.cos(toRad(endAngle));
  const y3 = center + innerRadius * Math.sin(toRad(endAngle));
  const x4 = center + innerRadius * Math.cos(toRad(startAngle));
  const y4 = center + innerRadius * Math.sin(toRad(startAngle));

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  const path = [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");

  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = (innerRadius + outerRadius) / 2;
  const labelX = center + labelRadius * Math.cos(toRad(midAngle));
  const labelY = center + labelRadius * Math.sin(toRad(midAngle));

  return (
    <g>
      <path
        d={path}
        fill={color}
        fillOpacity={isActive ? 0.9 : 0.6}
        stroke="oklch(0.07 0.012 260)"
        strokeWidth={2}
        style={{
          filter: isActive ? `drop-shadow(0 0 8px ${color})` : undefined,
          transition: "all 0.2s ease",
        }}
      />
      {endAngle - startAngle > 25 && (
        <>
          <text
            x={labelX}
            y={labelY - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={9}
            fontWeight="600"
            fontFamily="Outfit, system-ui, sans-serif"
          >
            {label}
          </text>
          <text
            x={labelX}
            y={labelY + 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={8}
            fontFamily="Outfit, system-ui, sans-serif"
            opacity={0.8}
          >
            {hours}h
          </text>
        </>
      )}
    </g>
  );
}

export default function ProductivityWheel() {
  const [blocks, setBlocks] = useState<TimeBlockData[]>(INITIAL_BLOCKS);
  const [activeBlock] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const saveMutation = useSaveDailyStats();

  const total = blocks.reduce((s, b) => s + b.hours, 0);

  const adjust = useCallback((idx: number, delta: number) => {
    setBlocks((prev) => {
      const updated = [...prev];
      const newHours = updated[idx].hours + delta;
      if (newHours < 0 || newHours > 24) return prev;
      const newTotal = prev.reduce(
        (s, b, i) => (i === idx ? s + newHours : s + b.hours),
        0,
      );
      if (newTotal > TOTAL_HOURS) return prev;
      updated[idx] = { ...updated[idx], hours: newHours };
      return updated;
    });
  }, []);

  const wastedHours = blocks
    .filter((b) => b.isWaste)
    .reduce((s, b) => s + b.hours, 0);
  const productiveHours = TOTAL_HOURS - wastedHours;

  const handleSave = async () => {
    const date = new Date().toISOString().split("T")[0];
    const timeBlocks = blocks.map((b) => ({
      name: b.name,
      hours: BigInt(b.hours),
    }));
    try {
      await saveMutation.mutateAsync({ date, timeBlocks });
      toast.success("Daily stats saved successfully!");
    } catch {
      toast.error("Failed to save — please try again");
    }
  };

  // Build wheel segments
  let cumulative = -90; // Start from top
  const segments = blocks.map((block) => {
    const angle = (block.hours / TOTAL_HOURS) * 360;
    const seg = {
      startAngle: cumulative,
      endAngle: cumulative + angle,
      color: block.hexColor,
      label: block.name,
      hours: block.hours,
    };
    cumulative += angle;
    return seg;
  });

  return (
    <section id="wheel" className="relative py-24 px-4 section-glow-divider">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 80% 50%, oklch(0.78 0.18 195 / 0.04) 0%, transparent 60%)",
        }}
      />

      <div ref={sectionRef} className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">Life Dashboard</p>
          <h2 className="text-4xl md:text-5xl font-black font-display text-foreground mb-4">
            Your <span className="neon-text-cyan">24-Hour</span> Life Wheel
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            See where your time truly goes. Adjust the hours and watch your
            reality reveal itself.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Wheel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <svg
                width="320"
                height="320"
                viewBox="0 0 320 320"
                role="img"
                aria-label="24-hour productivity wheel showing time distribution"
              >
                {segments.map((seg, i) => (
                  <WheelSegment
                    key={blocks[i].name}
                    startAngle={seg.startAngle}
                    endAngle={seg.endAngle}
                    color={seg.color}
                    innerRadius={70}
                    outerRadius={145}
                    label={seg.label}
                    hours={seg.hours}
                    isActive={activeBlock === i}
                  />
                ))}
                {/* Center */}
                <circle cx="160" cy="160" r="65" fill="oklch(0.09 0.015 260)" />
                <circle
                  cx="160"
                  cy="160"
                  r="60"
                  fill="oklch(0.12 0.02 260 / 0.8)"
                />
                <text
                  x="160"
                  y="152"
                  textAnchor="middle"
                  fill="oklch(0.78 0.18 195)"
                  fontSize="24"
                  fontWeight="900"
                  fontFamily="Outfit, system-ui, sans-serif"
                >
                  {total}h
                </text>
                <text
                  x="160"
                  y="172"
                  textAnchor="middle"
                  fill="oklch(0.55 0.04 250)"
                  fontSize="10"
                  fontFamily="Outfit, system-ui, sans-serif"
                >
                  of 24 hours
                </text>
              </svg>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-3"
          >
            {blocks.map((block, i) => (
              <div
                key={block.name}
                className={`flex items-center gap-3 glass-card rounded-xl px-4 py-3 border transition-all duration-200 ${
                  activeBlock === i
                    ? "border-[oklch(0.78_0.18_195/0.4)]"
                    : "border-[oklch(0.25_0.04_255/0.5)]"
                }`}
              >
                {/* Color dot */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: block.hexColor,
                    boxShadow: `0 0 6px ${block.hexColor}`,
                  }}
                />

                {/* Name */}
                <span
                  className={`flex-1 font-medium font-body text-sm ${block.color}`}
                >
                  {block.name}
                </span>
                {block.isWaste && (
                  <span className="text-xs bg-[oklch(0.63_0.25_25/0.2)] text-[oklch(0.67_0.25_25)] px-2 py-0.5 rounded-full border border-[oklch(0.63_0.25_25/0.3)]">
                    waste
                  </span>
                )}

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      adjust(i, -1);
                    }}
                    className="w-6 h-6 rounded-md bg-[oklch(0.15_0.02_255)] hover:bg-[oklch(0.22_0.03_260)] text-foreground transition-colors flex items-center justify-center text-sm font-bold"
                    aria-label={`Decrease ${block.name}`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-foreground">
                    {block.hours}h
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      adjust(i, 1);
                    }}
                    className="w-6 h-6 rounded-md bg-[oklch(0.15_0.02_255)] hover:bg-[oklch(0.22_0.03_260)] text-foreground transition-colors flex items-center justify-center text-sm font-bold"
                    aria-label={`Increase ${block.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {/* Total indicator */}
            {total < TOTAL_HOURS && (
              <p className="text-sm text-[oklch(0.88_0.18_90)] text-center">
                ⚠ {TOTAL_HOURS - total} hours unaccounted for
              </p>
            )}
          </motion.div>
        </div>

        {/* Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Productive hours */}
          <div className="glass-card-cyan rounded-2xl p-6 text-center">
            <div className="text-4xl font-black font-display neon-text-green mb-2">
              {productiveHours}h
            </div>
            <div className="text-sm font-body text-muted-foreground mb-1">
              Productive Hours
            </div>
            <div className="text-xs text-[oklch(0.82_0.18_142)]">
              {Math.round((productiveHours / TOTAL_HOURS) * 100)}% of your day
            </div>
          </div>

          {/* Wasted hours */}
          <div className="glass-card rounded-2xl p-6 text-center border border-[oklch(0.63_0.25_25/0.2)]">
            <div className="text-4xl font-black font-display neon-text-red mb-2">
              {wastedHours}h
            </div>
            <div className="text-sm font-body text-muted-foreground mb-1">
              Unproductive Hours
            </div>
            <div className="text-xs text-[oklch(0.67_0.25_25)]">
              {wastedHours * 7} hours/week, {wastedHours * 365} hours/year
            </div>
          </div>

          {/* Motivational */}
          <div className="glass-card-violet rounded-2xl p-6 text-center">
            <div className="text-lg font-bold font-display neon-text-cyan mb-2">
              Your Potential
            </div>
            <div className="text-sm font-body text-foreground/80 leading-relaxed">
              You have{" "}
              <span className="neon-text-cyan font-bold">
                {productiveHours} hours
              </span>{" "}
              of productive potential daily — that's{" "}
              <span className="neon-text-violet font-bold">
                {productiveHours * 365} hours
              </span>{" "}
              every year.
            </div>
          </div>
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex justify-center mt-8"
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="neon-btn-cyan rounded-xl px-8 py-3 font-semibold font-display text-base flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "💾"
            )}
            {saveMutation.isPending ? "Saving..." : "Save My Daily Stats"}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
