"use client";

import { useState, useEffect, useCallback } from "react";

export default function FiveDots() {
  const [activeDot, setActiveDot] = useState(0); // next dot to click (1-indexed, 0 = not started)
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [completed, setCompleted] = useState(false);
  const [litDots, setLitDots] = useState<Set<number>>(new Set());

  const handleDotClick = useCallback(
    (dotIndex: number) => {
      if (completed) return;

      if (direction === "forward") {
        if (dotIndex === activeDot + 1) {
          const newLit = new Set(litDots);
          newLit.add(dotIndex);
          setLitDots(newLit);
          setActiveDot(dotIndex);

          if (dotIndex === 5) {
            setDirection("backward");
          }
        }
      } else {
        // backward: need to click 4, 3, 2, 1
        const expected = activeDot - 1;
        if (dotIndex === expected) {
          const newLit = new Set(litDots);
          newLit.delete(dotIndex + 1); // unlight the previous one
          setLitDots(newLit);
          setActiveDot(expected);

          if (expected === 0) {
            setCompleted(true);
          }
        }
      }
    },
    [activeDot, direction, litDots, completed]
  );

  const reset = () => {
    setActiveDot(0);
    setDirection("forward");
    setCompleted(false);
    setLitDots(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <h1 className="text-3xl font-bold text-white mb-4">5 Dots</h1>

      <p className="text-gray-400 mb-12 text-center">
        {completed
          ? "🎉 You did it!"
          : direction === "forward"
          ? "Click the dots from left to right"
          : "Now go back — right to left!"}
      </p>

      {/* Dots */}
      <div className="flex gap-10 items-center">
        {[1, 2, 3, 4, 5].map((dot) => {
          const isLit = litDots.has(dot);
          const isNext =
            direction === "forward"
              ? dot === activeDot + 1
              : dot === activeDot - 1;

          return (
            <button
              key={dot}
              onClick={() => handleDotClick(dot)}
              disabled={completed}
              className={`w-16 h-16 rounded-full transition-all duration-300 border-2 ${
                isLit
                  ? "bg-yellow-400 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.7)] scale-110"
                  : isNext
                  ? "bg-gray-700 border-gray-400 hover:bg-gray-600 cursor-pointer hover:scale-105"
                  : "bg-gray-800 border-gray-600 opacity-50"
              }`}
              aria-label={`Dot ${dot}`}
            />
          );
        })}
      </div>

      {/* Confetti */}
      {completed && <Confetti />}

      {/* Reset */}
      {completed && (
        <button
          onClick={reset}
          className="mt-12 px-6 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
}

function Confetti() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    const colors = [
      "#f43f5e",
      "#3b82f6",
      "#22c55e",
      "#eab308",
      "#a855f7",
      "#ec4899",
      "#06b6d4",
      "#f97316",
    ];
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
