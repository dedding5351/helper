"use client";

import * as React from "react";
import type { AgentState } from "@livekit/components-react";
import { AmbientVisualizer } from "./AmbientVisualizer";
import { SessionControls } from "./SessionControls";

type Snapshot = {
  state: AgentState;
  volume: number;
  bars: number[];
};

const PHASES: { state: AgentState; durationMs: number }[] = [
  { state: "listening", durationMs: 2800 },
  { state: "thinking", durationMs: 1600 },
  { state: "speaking", durationMs: 4500 },
];

export function DemoStage({ onEnd }: { onEnd: () => void }) {
  const [muted, setMuted] = React.useState(false);
  const [snap, setSnap] = React.useState<Snapshot>({
    state: "listening",
    volume: 0.05,
    bars: [0.15, 0.18, 0.16, 0.2, 0.17],
  });

  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    let phaseStart = start;
    let phaseIdx = 0;

    const loop = (now: number) => {
      const t = (now - start) / 1000;
      let phase = PHASES[phaseIdx];
      if (now - phaseStart >= phase.durationMs) {
        phaseIdx = (phaseIdx + 1) % PHASES.length;
        phaseStart = now;
        phase = PHASES[phaseIdx];
      }

      let volume = 0;
      const bars = [0, 0, 0, 0, 0];

      if (phase.state === "listening") {
        volume = 0.06 + 0.04 * (0.5 + 0.5 * Math.sin(t * 0.9));
        for (let i = 0; i < 5; i++) {
          bars[i] = 0.18 + 0.08 * (0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.6));
        }
      } else if (phase.state === "thinking") {
        const flicker = Math.sin(t * 5.2) * 0.5 + 0.5;
        volume = 0.05 + (flicker > 0.88 ? 0.18 : 0) * Math.random();
        for (let i = 0; i < 5; i++) {
          bars[i] = 0.2 + 0.08 * (0.5 + 0.5 * Math.sin(t * 2.1 + i));
        }
      } else if (phase.state === "speaking") {
        const env = 0.5 + 0.5 * Math.sin(t * 2.4);
        volume = 0.28 + env * 0.55 + (Math.random() - 0.5) * 0.08;
        for (let i = 0; i < 5; i++) {
          const mod = 0.5 + 0.5 * Math.sin(t * (3 + i * 0.55) + i * 1.3);
          bars[i] = 0.32 + mod * 0.6 + (Math.random() - 0.5) * 0.12;
        }
      }

      setSnap({
        state: phase.state,
        volume: clamp01(volume),
        bars: bars.map(clamp01),
      });
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <AmbientVisualizer state={snap.state} volume={snap.volume} />
      <SessionControls
        state={snap.state}
        bars={snap.bars}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onEnd={onEnd}
      />
      <div className="pointer-events-none absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: "#fbbf24",
            boxShadow: "0 0 6px rgba(251,191,36,0.7)",
          }}
        />
        Demo Mode
      </div>
    </>
  );
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}
