"use client";

import * as React from "react";
import type { AgentState } from "@livekit/components-react";

type Props = {
  state: AgentState;
  /** 5 normalized bar heights in [0, 1] */
  bars: number[];
  muted: boolean;
  isSharingScreen?: boolean;
  onToggleMute: () => void;
  onToggleScreenShare?: () => void;
  onEnd: () => void;
};

export function SessionControls({
  state,
  bars,
  muted,
  isSharingScreen,
  onToggleMute,
  onToggleScreenShare,
  onEnd,
}: Props) {
  const isLive = state !== "disconnected" && state !== "connecting";

  return (
    <div
      role="region"
      aria-label="Live session controls"
      className="absolute bottom-6 right-6 z-10 flex items-center gap-3 rounded-full px-2 py-2 pr-2 backdrop-blur-xl"
      style={{
        background: "rgba(255,255,255,0.78)",
        boxShadow: "0 20px 50px rgba(20, 28, 35, 0.25)",
      }}
    >
      <div className="relative ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-gradient text-white">
        <span
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          graphic_eq
        </span>
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white"
          style={{ background: isLive ? "#22c55e" : "#94a3b8" }}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5 pr-1">
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-semibold tracking-tight text-foreground"
            style={{ letterSpacing: "-0.01em" }}
          >
            Live Session
          </span>
          <span
            className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em]"
            style={{ color: isLive ? "#5d5cde" : "#64748b" }}
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background: isLive ? "#5d5cde" : "#94a3b8",
                boxShadow: isLive ? "0 0 6px rgba(93,92,222,0.7)" : "none",
              }}
            />
            {labelForState(state)}
          </span>
          <Bars heights={bars} />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
          <span className="material-symbols-outlined text-[11px]">lock</span>
          <span>Encrypted Stream</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pl-1">
        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute microphone" : "Mute microphone"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/8 text-foreground/80 transition-colors hover:bg-foreground/15"
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {muted ? "mic_off" : "mic"}
          </span>
        </button>
        {onToggleScreenShare && (
          <button
            type="button"
            onClick={onToggleScreenShare}
            aria-pressed={isSharingScreen}
            aria-label={isSharingScreen ? "Stop sharing screen" : "Share screen"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/8 text-foreground/80 transition-colors hover:bg-foreground/15"
            style={{
              color: isSharingScreen ? "#22c55e" : undefined,
              background: isSharingScreen ? "rgba(34, 197, 94, 0.15)" : undefined,
            }}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isSharingScreen ? "stop_screen_share" : "screen_share"}
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={onEnd}
          aria-label="End session"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            boxShadow: "0 6px 16px rgba(220,38,38,0.35)",
          }}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            call_end
          </span>
        </button>
      </div>
    </div>
  );
}

function Bars({ heights }: { heights: number[] }) {
  return (
    <div className="flex h-4 w-12 items-center justify-between gap-[3px]">
      {heights.map((h, i) => (
        <span
          key={i}
          className="block w-[2px] rounded-full"
          style={{
            height: `${Math.max(12, Math.min(100, h * 100))}%`,
            background: "linear-gradient(180deg, #7777fa 0%, #4f4dcf 100%)",
            transition: "height 90ms ease-out",
          }}
        />
      ))}
    </div>
  );
}

function labelForState(state: AgentState): string {
  switch (state) {
    case "connecting":
      return "Connecting";
    case "listening":
      return "Active";
    case "thinking":
      return "Thinking";
    case "speaking":
      return "Speaking";
    case "disconnected":
      return "Offline";
    default:
      return "Active";
  }
}
