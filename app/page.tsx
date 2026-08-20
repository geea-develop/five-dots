"use client";

import { useState, useEffect, useCallback } from "react";

export default function FiveDots() {
  const [activeDot, setActiveDot] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [completed, setCompleted] = useState(false);
  const [litDots, setLitDots] = useState<Set<number>>(new Set());
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

          if (dotIndex === 5) {
            setDirection("backward");
          }
        }
      } else {
        const expected = activeDot - 1;
        if (dotIndex === expected) {
          const newLit = new Set(litDots);
          newLit.delete(activeDot);
          setLitDots(newLit);
          setActiveDot(expected);

          if (expected === 1) {
            const finalLit = new Set(newLit);
            finalLit.delete(expected);
            setLitDots(finalLit);
            setCompleted(true);
          }
        }
      }
    },
    [activeDot, direction, litDots, completed]
  );

  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => reset(), 4000);
      return () => clearTimeout(timer);
    }
  }, [completed]);

  const reset = () => {
    setActiveDot(0);
    setDirection("forward");
    setCompleted(false);
    setLitDots(new Set());
  };

  const nextExpected =
    direction === "forward" ? activeDot + 1 : activeDot - 1;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${completed ? "bg-black" : "bg-gray-900"}`}>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 z-10">5 Dots</h1>

      <p className="text-sm sm:text-base text-gray-400 mb-8 sm:mb-12 text-center z-10">
        {completed
          ? "🪩 You did it!"
          : direction === "forward"
          ? "Click the dots from left to right"
          : "Now go back — right to left!"}
      </p>

      {/* Dots */}
      <div className="flex gap-4 sm:gap-10 items-center z-10">
        {[1, 2, 3, 4, 5].map((dot) => {
          const isLit = litDots.has(dot);
          const isNext = !completed && dot === nextExpected;

          let className =
            "w-12 h-12 sm:w-16 sm:h-16 rounded-full transition-all duration-300 border-2 ";

          if (isNext) {
            className +=
              "bg-gray-600 border-yellow-400 hover:bg-gray-500 cursor-pointer hover:scale-110 shadow-[0_0_12px_rgba(250,204,21,0.4)]";
          } else if (isLit) {
            className +=
              "bg-yellow-400 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.7)] scale-110";
          } else {
            className += "bg-gray-800 border-gray-600 opacity-50";
          }

          if (completed) {
            className = "w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white animate-disco-dot";
            className += ` disco-dot-${dot}`;
          }

          return (
            <button
              key={dot}
              onClick={() => handleDotClick(dot)}
              disabled={completed}
              className={className}
              aria-label={`Dot ${dot}`}
            />
          );
        })}
      </div>

      {/* Disco celebration */}
      {completed && <Disco />}
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
