"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Generate a click sound using Web Audio API
function playClickSound(pitch: number = 1) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(400 * pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600 * pitch, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
    setTimeout(() => ctx.close(), 200);
  } catch {}
}

// Disco beat using Web Audio API
function playDiscoBeat(duration: number = 6) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bpm = 120;
    const beatInterval = 60 / bpm;
    const totalBeats = Math.floor(duration / beatInterval);

    for (let i = 0; i < totalBeats; i++) {
      const time = ctx.currentTime + i * beatInterval;
      
      // Kick drum
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.connect(kickGain);
      kickGain.connect(ctx.destination);
      kickOsc.type = "sine";
      kickOsc.frequency.setValueAtTime(150, time);
      kickOsc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
      kickGain.gain.setValueAtTime(0.4, time);
      kickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
      kickOsc.start(time);
      kickOsc.stop(time + 0.15);

      // Hi-hat on off-beats
      if (i % 2 === 1) {
        const noise = ctx.createBufferSource();
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;
        noise.buffer = noiseBuffer;
        const hihatGain = ctx.createGain();
        const hihatFilter = ctx.createBiquadFilter();
        hihatFilter.type = "highpass";
        hihatFilter.frequency.value = 8000;
        noise.connect(hihatFilter);
        hihatFilter.connect(hihatGain);
        hihatGain.connect(ctx.destination);
        hihatGain.gain.setValueAtTime(0.15, time);
        hihatGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        noise.start(time);
        noise.stop(time + 0.05);
      }
    }

    setTimeout(() => ctx.close(), (duration + 0.5) * 1000);
  } catch {}
}

// Haptic feedback
function vibrate(pattern: number | number[] = 30) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

export default function FiveDots() {
  const [activeDot, setActiveDot] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [completed, setCompleted] = useState(false);
  const [litDots, setLitDots] = useState<Set<number>>(new Set());
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [directionFlash, setDirectionFlash] = useState(false);

  const handleDotClick = useCallback(
    (dotIndex: number) => {
      if (completed) return;

      if (direction === "forward") {
        const expected = activeDot + 1;
        if (dotIndex === expected) {
          const newLit = new Set(litDots);
          newLit.add(dotIndex);
          setLitDots(newLit);
          setActiveDot(dotIndex);

          // Sound: ascending pitch
          playClickSound(0.8 + dotIndex * 0.15);
          vibrate(30);

          if (dotIndex === 5) {
            setDirection("backward");
            setDirectionFlash(true);
            vibrate([50, 30, 50]); // double buzz for direction change
            setTimeout(() => setDirectionFlash(false), 600);
          }
        }
      } else {
        const expected = activeDot - 1;
        if (dotIndex === expected) {
          const newLit = new Set(litDots);
          newLit.delete(activeDot);
          setLitDots(newLit);
          setActiveDot(expected);

          // Sound: descending pitch
          playClickSound(0.8 + expected * 0.15);
          vibrate(30);

          if (expected === 1) {
            const finalLit = new Set(newLit);
            finalLit.delete(expected);
            setLitDots(finalLit);
            setCompleted(true);
            vibrate([100, 50, 100, 50, 200]); // celebration vibration
            playDiscoBeat(12);
          }
        }
      }
    },
    [activeDot, direction, litDots, completed]
  );

  useEffect(() => {
    if (completed) {
      fetch("https://dummyjson.com/quotes/random")
        .then((res) => res.json())
        .then((data) => setQuote({ text: data.quote, author: data.author }))
        .catch(() => setQuote({ text: "You're amazing!", author: "5 Dots" }));

      const timer = setTimeout(() => reset(), 12000);
      return () => clearTimeout(timer);
    }
  }, [completed]);

  const reset = () => {
    setActiveDot(0);
    setDirection("forward");
    setCompleted(false);
    setLitDots(new Set());
    setQuote(null);
    setDirectionFlash(false);
  };

  const nextExpected =
    direction === "forward" ? activeDot + 1 : activeDot - 1;

  return (
    <div className={`h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${completed ? "bg-black" : "bg-gray-900"}`}>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 z-10">5 Dots</h1>

      <p className={`text-sm sm:text-base mb-8 sm:mb-12 text-center z-10 transition-all duration-300 ${
        directionFlash ? "text-yellow-400 scale-110 font-bold" : "text-gray-400"
      }`}>
        {completed
          ? "🪩 You did it!"
          : direction === "forward"
          ? "Click the dots from left to right"
          : "Now go back — right to left!"}
      </p>

      {/* Dots */}
      <div className="flex gap-3 sm:gap-10 items-center z-10">
        {[1, 2, 3, 4, 5].map((dot) => {
          const isLit = litDots.has(dot);
          const isNext = !completed && dot === nextExpected;

          let className =
            "w-10 h-10 sm:w-16 sm:h-16 rounded-full transition-all duration-300 border-2 ";

          if (isNext) {
            className +=
              "bg-yellow-400 border-white border-4 cursor-pointer scale-125 shadow-[0_0_25px_rgba(250,204,21,0.8)] animate-pulse";
          } else if (isLit) {
            className +=
              "bg-yellow-600 border-yellow-700 shadow-[0_0_10px_rgba(250,204,21,0.3)]";
          } else {
            className += "bg-gray-800 border-gray-600 opacity-40";
          }

          if (completed) {
            className = "w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2 border-white animate-disco-dot";
            className += ` disco-dot-${dot}`;
          }

          return (
            <button
              key={dot}
              onClick={() => handleDotClick(dot)}
              disabled={completed}
              className={`${className} relative`}
              aria-label={`Dot ${dot}`}
            >
              {isNext && !completed && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 text-lg animate-bounce">
                  👆
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Disco celebration */}
      {completed && <Disco />}

      {/* Quote */}
      {completed && quote && (
        <div className="mt-8 max-w-sm text-center z-10 animate-fade-in">
          <p className="text-white text-lg italic">&ldquo;{quote.text}&rdquo;</p>
          <p className="text-gray-400 mt-2 text-sm">— {quote.author}</p>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-4 flex flex-col items-center gap-2 z-10">
        <img
          src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Fgeea-develop.github.io%2Ffive-dots&label=visitors&icon=eye&color=%23555"
          alt="visitor count"
          className="h-5"
        />
        <a
          href="https://dummyjson.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
        >
          Quotes by DummyJSON
        </a>
        <span className="text-gray-700 text-[10px]">
          build {process.env.NEXT_PUBLIC_BUILD_ID?.slice(0, 7) || "local"} 🎯
        </span>
      </div>
    </div>
  );
}

function Disco() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Disco ball */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 via-white to-gray-400 animate-spin-slow shadow-[0_0_60px_rgba(255,255,255,0.5)]">
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/60 rounded-sm"
              style={{
                top: `${20 + Math.sin(i * 0.5) * 30}%`,
                left: `${20 + Math.cos(i * 0.8) * 30}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Light beams */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`beam-${i}`}
          className="absolute top-20 left-1/2 origin-top animate-beam"
          style={{
            width: "4px",
            height: "100vh",
            background: `linear-gradient(to bottom, ${
              ["#f43f5e", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ec4899", "#06b6d4", "#f97316"][i]
            }, transparent)`,
            transform: `rotate(${i * 45 - 180}deg)`,
            opacity: 0.6,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      {/* Floor tiles flashing */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 grid grid-cols-6 grid-rows-3 gap-1 p-2 opacity-40">
        {Array.from({ length: 18 }, (_, i) => (
          <div
            key={`tile-${i}`}
            className="rounded-sm animate-tile"
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
