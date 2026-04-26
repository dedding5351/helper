"use client";

import * as React from "react";
import type { AgentState } from "@livekit/components-react";

type Props = {
  state: AgentState;
  volume: number;
};

export function AmbientVisualizer({ state, volume }: Props) {
  // Volume usually ranges from 0 to 1
  const scale = 1 + volume * 1.5;
  
  // Colors based on state
  let glowColor = "rgba(148, 163, 184, 0.4)"; // Default/Offline (slate-400)
  if (state === "listening") {
    glowColor = "rgba(34, 197, 94, 0.6)"; // Green
  } else if (state === "thinking") {
    glowColor = "rgba(234, 179, 8, 0.6)"; // Yellow
  } else if (state === "speaking") {
    glowColor = "rgba(93, 92, 222, 0.8)"; // Primary purple
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Core orb */}
        <div
          className="absolute rounded-full bg-white transition-all duration-100 ease-out"
          style={{
            width: "80px",
            height: "80px",
            transform: `scale(${scale})`,
            boxShadow: `0 0 ${40 + volume * 60}px ${glowColor}, inset 0 0 20px rgba(255,255,255,0.8)`,
            opacity: state === "disconnected" ? 0 : 1,
          }}
        />
        {/* Outer glow aura */}
        <div
          className="absolute rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: "240px",
            height: "240px",
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            transform: `scale(${scale * 0.8})`,
            opacity: state === "disconnected" ? 0 : 0.7 + volume * 0.3,
            filter: "blur(24px)",
          }}
        />
      </div>
    </div>
  );
}
