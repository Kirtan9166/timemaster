import { Toaster } from "@/components/ui/sonner";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import AIProductivityWidget from "./components/AIProductivityWidget";
import AnimatedCounter from "./components/AnimatedCounter";
import ConceptCards from "./components/ConceptCards";
import DailyPlanner from "./components/DailyPlanner";
import GoalTracker from "./components/GoalTracker";
import InteractiveLearning from "./components/InteractiveLearning";
import MusicPlayer from "./components/MusicPlayer";
import PomodoroTimer from "./components/PomodoroTimer";
import ProductivityWheel from "./components/ProductivityWheel";
import ScrollProgressBar from "./components/ScrollProgressBar";
import StatsSection from "./components/StatsSection";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const HeroClock = lazy(() => import("./components/HeroClock"));

// Navigation
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Concepts", href: "#concepts" },
    { label: "Learn", href: "#interactive" },
    { label: "Life Wheel", href: "#wheel" },
    { label: "Tools", href: "#tools" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    const id = href.replace("#", "");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.07_0.012_260/0.85)] backdrop-blur-xl border-b border-[oklch(0.25_0.04_255/0.3)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.82_0.18_85/0.1)] border border-[oklch(0.82_0.18_85/0.35)] flex items-center justify-center group-hover:border-[oklch(0.82_0.18_85/0.7)] group-hover:shadow-[0_0_16px_oklch(0.82_0.18_85/0.3)] transition-all duration-300 flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke="oklch(0.88 0.2 85)"
                strokeWidth="1.2"
              />
              <line
                x1="8"
                y1="8"
                x2="8"
                y2="3"
                stroke="oklch(0.88 0.2 85)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="8"
                x2="11.5"
                y2="9.5"
                stroke="oklch(0.68 0.22 230)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="8" cy="8" r="1" fill="oklch(0.88 0.2 85)" />
            </svg>
          </div>
          <span className="font-black font-display text-base tracking-tight neon-text-gold hidden sm:block">
            TimeMaster
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium font-body text-muted-foreground hover:text-foreground transition-colors duration-200 hover:neon-text-gold"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + theme toggle */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 neon-btn-gold"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setTimeout(() => {
                const el = document.getElementById("tools");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 50);
            }}
            className="hidden md:block neon-btn-gold rounded-lg px-4 py-2 text-sm font-semibold font-display"
          >
            Free Tools →
          </button>

          {/* Mobile menu */}
          <button
            type="button"
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-current transition-transform duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              />
              <span
                className={`block h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-current transition-transform duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[oklch(0.09_0.015_260/0.95)] backdrop-blur-xl border-b border-[oklch(0.25_0.04_255/0.3)]"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-base font-medium font-body text-foreground/80 hover:text-foreground transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Hero section
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh"
    >
      {/* Decorative radial glow behind clock */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 50%, oklch(0.82 0.18 85 / 0.06) 0%, transparent 65%)",
        }}
      />

      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.82 0.18 85 / 0.015) 2px, oklch(0.82 0.18 85 / 0.015) 4px)",
        }}
      />

      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-20">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <p className="section-label">The 3D Time Experience</p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-5xl md:text-7xl font-black font-display leading-[1.05] mb-6 tracking-tight"
            >
              <span className="block" style={{ color: "oklch(0.52 0.02 240)" }}>
                Time is not
              </span>
              <span
                className="block"
                style={{ color: "oklch(0.65 0.025 240)" }}
              >
                money. It is
              </span>
              <span
                className="hero-gradient-text hero-word-accent"
                style={{
                  fontStyle: "italic",
                  fontSize: "1.22em",
                  letterSpacing: "-0.03em",
                  display: "block",
                  lineHeight: 1.1,
                  marginTop: "0.05em",
                }}
              >
                LIFE.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-xl text-muted-foreground font-body leading-relaxed mb-8 max-w-lg"
            >
              Master your time. Master your life.
              <br />
              Free tools, proven principles, and interactive lessons — all in
              one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#concepts"
                className="neon-btn-gold rounded-xl px-8 py-4 font-bold font-display text-sm tracking-wide relative overflow-hidden group"
                style={{ letterSpacing: "0.06em" }}
              >
                <span className="relative z-10">START LEARNING →</span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.88 0.2 85 / 0.15) 0%, transparent 70%)",
                  }}
                />
              </a>
              <a
                href="#tools"
                className="neon-btn-blue rounded-xl px-8 py-4 font-bold font-display text-sm tracking-wide relative overflow-hidden group"
                style={{ letterSpacing: "0.06em" }}
              >
                <span className="relative z-10">FREE TOOLS</span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.68 0.22 230 / 0.15) 0%, transparent 70%)",
                  }}
                />
              </a>
            </motion.div>

            {/* Stats with animated counters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-wrap gap-10 mt-14 pt-8 border-t border-[oklch(0.82_0.18_85/0.15)]"
            >
              {[
                { label: "Time Principles", value: 5, suffix: "+" },
                { label: "Free Tools", value: 3, suffix: "" },
                { label: "Hours Saved Daily", value: "∞", suffix: "" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <p
                    className="text-4xl font-black font-display hero-gradient-text"
                    style={{ animationDelay: `${1.2 + i * 0.1}s` }}
                  >
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      duration={1.8}
                    />
                  </p>
                  <p className="text-xs text-muted-foreground font-body tracking-wide uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 3D Clock — floating */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-square max-w-md float-anim"
            >
              {/* Outer glow rings */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, oklch(0.82 0.18 85 / 0.1) 0%, oklch(0.68 0.22 230 / 0.05) 50%, transparent 70%)",
                }}
              />
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-[oklch(0.82_0.18_85)] border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <HeroClock />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <p className="text-xs text-muted-foreground font-body tracking-wider uppercase">
          Scroll to explore
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="w-px h-8 bg-gradient-to-b from-[oklch(0.82_0.18_85)] to-transparent"
        />
      </motion.div>
    </section>
  );
}

// Tools section
function ToolsSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="tools" className="relative py-24 px-4 section-glow-divider">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 60%, oklch(0.68 0.22 230 / 0.04) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <p className="section-label">Productivity Arsenal</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-foreground mb-4 tracking-tight">
            Free <span className="neon-text-blue">Tools</span> for{" "}
            <span className="neon-text-gold">Every Day</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            No signup. No paywall. Just tools that work.
          </p>
        </motion.div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { component: <PomodoroTimer />, delay: 0.1, id: "pomodoro" },
            { component: <GoalTracker />, delay: 0.2, id: "goals" },
            { component: <DailyPlanner />, delay: 0.3, id: "planner" },
          ].map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: item.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {item.component}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  return (
    <footer className="relative border-t border-[oklch(0.82_0.18_85/0.15)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg">⏱</span>
            <span className="font-black font-display neon-text-gold">
              TimeMaster
            </span>
            <span className="text-muted-foreground font-body text-sm">
              — Master Your Time. Master Your Life.
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-body">
            {[
              { label: "Concepts", href: "#concepts" },
              { label: "Learn", href: "#interactive" },
              { label: "Life Wheel", href: "#wheel" },
              { label: "Tools", href: "#tools" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-[oklch(0.82_0.18_85/0.1)] mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-body">
          <p>© {year} TimeMaster. All principles free, always.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressBar />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.12 0.02 260)",
            border: "1px solid oklch(0.25 0.04 255)",
            color: "oklch(0.96 0.01 240)",
          },
        }}
      />
      <Navbar />

      <main>
        <HeroSection />
        <StatsSection />
        <ConceptCards />
        <InteractiveLearning />
        <ProductivityWheel />
        <ToolsSection />
      </main>

      <Footer />
      <MusicPlayer />
      <AIProductivityWidget />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
