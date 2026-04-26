"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useMultibandTrackVolume,
  useTrackVolume,
  useVoiceAssistant,
} from "@livekit/components-react";
import { SessionControls } from "./SessionControls";
import { DemoStage } from "./DemoStage";
import { AmbientVisualizer } from "./AmbientVisualizer";

type TokenResponse = {
  token: string;
  serverUrl: string;
};

export function SessionRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceDemo = searchParams.get("demo") !== null;

  const [conn, setConn] = React.useState<TokenResponse | null>(null);
  const [demo, setDemo] = React.useState(forceDemo);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (forceDemo) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/livekit-token", { method: "POST" });
        if (res.status === 503) {
          if (!cancelled) setDemo(true);
          return;
        }
        if (!res.ok) throw new Error(`Token request failed (${res.status})`);
        const data = (await res.json()) as TokenResponse;
        if (!cancelled) setConn(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Connection failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [forceDemo]);

  const handleEnd = React.useCallback(() => {
    router.push("/user");
  }, [router]);

  if (error) return <ConnectionError message={error} />;
  if (demo) return <DemoStage onEnd={handleEnd} />;
  if (!conn) return <ConnectingState />;

  return (
    <LiveKitRoom
      token={conn.token}
      serverUrl={conn.serverUrl}
      connect
      audio
      video={false}
      onDisconnected={handleEnd}
      className="contents"
    >
      <RoomAudioRenderer />
      <LiveStage onEnd={handleEnd} />
    </LiveKitRoom>
  );
}

function LiveStage({ onEnd }: { onEnd: () => void }) {
  const { state, audioTrack } = useVoiceAssistant();
  const volume = useTrackVolume(audioTrack);
  const bands = useMultibandTrackVolume(audioTrack, { bands: 5 });
  const { localParticipant, isMicrophoneEnabled, isScreenShareEnabled } = useLocalParticipant();

  const toggleMute = React.useCallback(() => {
    void localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  }, [localParticipant, isMicrophoneEnabled]);

  const toggleScreenShare = React.useCallback(async () => {
    if (isScreenShareEnabled) {
      await localParticipant.setScreenShareEnabled(false);
    } else {
      try {
        await localParticipant.setScreenShareEnabled(true, { systemAudio: 'exclude' });
      } catch (err) {
        console.error("Failed to share screen", err);
      }
    }
  }, [isScreenShareEnabled, localParticipant]);

  return (
    <>
      <AmbientVisualizer state={state} volume={volume} />
      <SessionControls
        state={state}
        bars={bands.length === 5 ? bands : [0, 0, 0, 0, 0]}
        muted={!isMicrophoneEnabled}
        onToggleMute={toggleMute}
        isSharingScreen={isScreenShareEnabled}
        onToggleScreenShare={toggleScreenShare}
        onEnd={onEnd}
      />
    </>
  );
}

function ConnectingState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, rgba(190,220,235,0.55) 0%, rgba(150,200,225,0.25) 35%, rgba(90,140,170,0) 70%)",
          filter: "blur(40px)",
        }}
      />
      <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
        Connecting…
      </p>
    </div>
  );
}

function ConnectionError({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="glass-modal max-w-sm rounded-2xl p-8 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-destructive">
          Session unavailable
        </p>
        <p className="mb-6 text-sm font-light leading-relaxed text-foreground">
          {message}.
        </p>
        <Link
          href="/user"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
