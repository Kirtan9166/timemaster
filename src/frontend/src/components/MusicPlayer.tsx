import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const TRACK = {
  name: "Ambient Focus — Vol. 1",
  artist: "TimeMaster Radio",
  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
};

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(TRACK.src);
    audio.loop = true;
    audio.volume = 0.4;
    audio.muted = false;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [isMuted]);

  function handleTogglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        // autoplay blocked — silently ignore
      });
      setIsPlaying(true);
    }
  }

  function handleToggleMute() {
    setIsMuted((v) => !v);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded player panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card rounded-2xl p-4 w-64"
            style={{
              border: "1px solid oklch(0.82 0.18 85 / 0.3)",
              boxShadow:
                "0 0 24px oklch(0.82 0.18 85 / 0.12), 0 8px 32px oklch(0.05 0.01 260 / 0.6)",
            }}
          >
            {/* Track info */}
            <div className="flex items-center gap-3 mb-4">
              {/* Animated vinyl */}
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.18 85 / 0.3), oklch(0.68 0.22 230 / 0.3))",
                  border: "1px solid oklch(0.82 0.18 85 / 0.4)",
                  animation: isPlaying ? "spin 3s linear infinite" : "none",
                }}
              >
                🎵
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold font-display truncate"
                  style={{ color: "oklch(0.88 0.2 85)" }}
                >
                  {TRACK.name}
                </p>
                <p className="text-xs text-muted-foreground font-body truncate">
                  {TRACK.artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-2">
              {/* Play/Pause */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="neon-btn-gold rounded-xl px-4 py-2 text-sm font-semibold font-display flex items-center gap-2 flex-1"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <span className="text-base">{isPlaying ? "⏸" : "▶"}</span>
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>

              {/* Mute toggle */}
              <button
                type="button"
                onClick={handleToggleMute}
                className="neon-btn-blue rounded-xl p-2 text-lg leading-none"
                aria-label={isMuted ? "Unmute" : "Mute"}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>

            {/* Volume slider */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-body">
                Vol
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-1 accent-[oklch(0.82_0.18_85)] cursor-pointer"
                aria-label="Volume"
              />
            </div>

            {/* Now playing indicator */}
            {isPlaying && (
              <div className="mt-3 flex items-center gap-1.5">
                {[0, 0.15, 0.3].map((delay) => (
                  <span
                    key={delay}
                    className="block w-1 rounded-full"
                    style={{
                      height: "12px",
                      background: "oklch(0.82 0.18 85)",
                      animation: `float 0.8s ${delay}s ease-in-out infinite`,
                      boxShadow: "0 0 6px oklch(0.82 0.18 85 / 0.8)",
                    }}
                  />
                ))}
                <span
                  className="text-xs font-body ml-1"
                  style={{ color: "oklch(0.82 0.18 85)" }}
                >
                  Now Playing
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl relative"
        style={{
          background: isOpen
            ? "oklch(0.82 0.18 85 / 0.25)"
            : "oklch(0.13 0.022 262 / 0.85)",
          border: "1px solid oklch(0.82 0.18 85 / 0.5)",
          boxShadow: isPlaying
            ? "0 0 20px oklch(0.82 0.18 85 / 0.5), 0 0 40px oklch(0.82 0.18 85 / 0.2)"
            : "0 0 12px oklch(0.82 0.18 85 / 0.2)",
          backdropFilter: "blur(20px)",
        }}
        aria-label="Toggle music player"
      >
        {isPlaying ? (
          <span style={{ animation: "pulse-glow 1.5s ease-in-out infinite" }}>
            🎵
          </span>
        ) : (
          "♪"
        )}
        {isPlaying && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid oklch(0.82 0.18 85 / 0.4)",
              animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
        )}
      </motion.button>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
