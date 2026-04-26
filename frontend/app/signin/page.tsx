import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SignInPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <main className="relative min-h-screen w-full overflow-hidden bg-background">
        {/* Ambient luminous wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 10%, rgba(119,119,250,0.10) 0%, rgba(247,249,251,0) 70%), radial-gradient(50% 40% at 85% 90%, rgba(140,108,148,0.08) 0%, rgba(247,249,251,0) 70%)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(44,52,55,0.025) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-6 md:px-16">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground"
            style={{ letterSpacing: "-0.02em" }}
          >
            Project Name
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </nav>

        <section className="relative mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl items-center justify-center px-8 py-16 md:px-16">
          <Card
            className="glass-modal relative w-full max-w-md overflow-hidden rounded-2xl border-none p-12 ring-0"
            style={{ boxShadow: "0 20px 60px rgba(44, 52, 55, 0.06)" }}
          >
            <div className="flex flex-col items-start">
              <Badge
                variant="secondary"
                className="mb-10 flex items-center rounded-full border-none bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground shadow-none"
              >
                <span className="material-symbols-outlined mr-2 text-[16px] text-primary">
                  bolt
                </span>
                Welcome back
              </Badge>

              <h1
                className="mb-4 text-4xl font-bold leading-[1.05] tracking-tight text-foreground"
                style={{ letterSpacing: "-0.03em" }}
              >
                Sign in to{" "}
                <span className="bg-primary-gradient bg-clip-text text-transparent">
                  the Archive.
                </span>
              </h1>

              <p className="mb-10 max-w-sm text-base font-light leading-relaxed text-muted-foreground">
                Choose how you'd like to continue. Your context follows you across every surface.
              </p>

              <div className="flex w-full flex-col gap-3">
                <Link href="/it" className="w-full">
                  <Button className="bg-primary-gradient h-auto w-full justify-between rounded-md border-none px-6 py-5 text-base text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90">
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">
                        shield_person
                      </span>
                      Sign in as IT Specialist
                    </span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </Button>
                </Link>

                <Link href="/user" className="w-full">
                  <Button
                    variant="secondary"
                    className="h-auto w-full justify-between rounded-md border-none bg-secondary/10 px-6 py-5 text-base text-primary shadow-none transition-colors hover:bg-secondary/20"
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">
                        person
                      </span>
                      Sign in as User
                    </span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </Button>
                </Link>
              </div>

              <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Need access? Contact your administrator.
              </p>
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}
