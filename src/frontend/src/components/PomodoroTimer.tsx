import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
const TOTAL_SESSIONS = 4;

type Mode = "work" | "break";

function playBeep() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      440,
      ctx.currentTime + 0.3,
    );
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    // AudioContext not available
  }
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const duration = mode === "work" ? WORK_DURATION : BREAK_DURATION;
  const progress = timeLeft / duration;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(WORK_DURATION);
    setMode("work");
    setSession(1);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playBeep();
          setIsRunning(false);
          if (mode === "work") {
            setSession((s) => {
              const next = s < TOTAL_SESSIONS ? s + 1 : 1;
              return next;
            });
            setMode("break");
            setTimeLeft(BREAK_DURATION);
          } else {
            setMode("work");
            setTimeLeft(WORK_DURATION);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  // SVG ring
  const cx = 80;
  const cy = 80;
  const r = 68;
  const circumference = 2 * Math.PI * r;
  const strokeDash = circumference * progress;
  const ringColor =
    mode === "work" ? "oklch(0.78 0.18 195)" : "oklch(0.82 0.18 142)";
  const ringGlow =
    mode === "work"
      ? "oklch(0.78 0.18 195 / 0.4)"
      : "oklch(0.82 0.18 142 / 0.4)";

  return (
    <div className="glass-card rounded-2xl p-6 border border-[oklch(0.25_0.04_255/0.5)] flex flex-col items-center">
      <h3 className="text-lg font-bold font-display neon-text-cyan mb-1">
        Pomodoro Timer
      </h3>
      <p className="text-xs text-muted-foreground font-body mb-5">
        Focus · Break · Repeat
      </p>

      {/* Mode indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
            mode === "work"
              ? "bg-[oklch(0.78_0.18_195/0.15)] text-[oklch(0.78_0.18_195)] border border-[oklch(0.78_0.18_195/0.3)]"
              : "bg-[oklch(0.82_0.18_142/0.15)] text-[oklch(0.82_0.18_142)] border border-[oklch(0.82_0.18_142/0.3)]"
          }`}
        >
          {mode === "work" ? "🎯 Deep Work" : "☕ Break Time"}
        </motion.div>
      </AnimatePresence>

      {/* SVG Ring */}
      <div className="relative mb-5">
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          role="img"
          aria-label="Pomodoro timer progress ring"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="oklch(0.15 0.02 255)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            transform="rotate(-90 80 80)"
            filter="url(#glow)"
            style={{
              transition: "stroke-dasharray 0.5s ease",
              filter: `drop-shadow(0 0 6px ${ringGlow})`,
            }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${minutes}:${seconds}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-3xl font-black font-mono ${
                mode === "work" ? "neon-text-cyan" : "neon-text-green"
              }`}
            >
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Session indicator */}
      <div className="flex gap-2 mb-5">
        {[1, 2, 3, 4].slice(0, TOTAL_SESSIONS).map((n) => (
          <div
            key={`session-${n}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              n <= session
                ? "bg-[oklch(0.78_0.18_195)] shadow-[0_0_6px_oklch(0.78_0.18_195)]"
                : "bg-[oklch(0.22_0.03_260)]"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        Session {session} of {TOTAL_SESSIONS}
      </p>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsRunning((v) => !v)}
          className={`px-5 py-2 rounded-xl font-semibold font-display text-sm transition-all duration-200 ${
            isRunning
              ? "bg-[oklch(0.88_0.18_90/0.15)] border border-[oklch(0.88_0.18_90/0.5)] text-[oklch(0.92_0.18_90)] hover:bg-[oklch(0.88_0.18_90/0.25)]"
              : "neon-btn-cyan"
          }`}
        >
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2 rounded-xl font-semibold font-display text-sm bg-[oklch(0.15_0.02_255)] border border-[oklch(0.25_0.04_255/0.5)] text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
