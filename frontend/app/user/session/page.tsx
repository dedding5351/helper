import * as React from "react";
import Link from "next/link";
import { SessionRoom } from "./components/SessionRoom";

export default function SessionPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <main className="relative min-h-screen w-full overflow-hidden bg-transparent">

        <Link
          href="/user"
          className="absolute left-6 top-6 z-20 flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
        >
          <span className="material-symbols-outlined text-[14px]">
            arrow_back
          </span>
          Dashboard
        </Link>

        <React.Suspense fallback={null}>
          <SessionRoom />
        </React.Suspense>
      </main>
    </>
  );
}
