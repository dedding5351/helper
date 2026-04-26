import * as React from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex h-20 shrink-0 items-center justify-between px-8 border-b border-transparent">
        <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
          Settings
        </h1>
      </header>

      <main className="flex-1 overflow-auto px-8 py-8">
        <div className="flex max-w-5xl gap-16">
          {/* Settings Nav */}
          <div className="w-48 shrink-0">
            <nav className="flex flex-col gap-2">
              <button className="text-left text-sm font-semibold text-primary">General</button>
              <button className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Notifications</button>
              <button className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">AI Agent Config</button>
              <button className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Security</button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 max-w-2xl">
            <section className="mb-12">
              <h2 className="mb-6 text-lg font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.01em" }}>
                Profile Configuration
              </h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Sarah Jenkins"
                    className="h-11 w-full rounded-md border border-outline-variant/15 bg-surface-container-lowest px-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    defaultValue="sarah.jenkins@projectname.com"
                    disabled
                    className="h-11 w-full rounded-md border border-outline-variant/15 bg-surface-container px-4 text-sm text-muted-foreground opacity-60"
                  />
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-lg font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.01em" }}>
                Preferences
              </h2>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-foreground">Compact Queue Density</span>
                    <span className="text-xs text-muted-foreground">Display more issues per page in the Inbox and Active lists.</span>
                  </div>
                  {/* Fake Toggle Switch */}
                  <div className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-primary p-1 shadow-inner">
                    <div className="h-4 w-4 translate-x-5 rounded-full bg-white shadow-sm transition-transform" />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-foreground">Show AI Confidence Scores</span>
                    <span className="text-xs text-muted-foreground">Display the AI agent's internal confidence score on escalated tickets.</span>
                  </div>
                  {/* Fake Toggle Switch Off */}
                  <div className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-secondary/20 p-1 shadow-inner">
                    <div className="h-4 w-4 translate-x-0 rounded-full bg-white shadow-sm transition-transform" />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-6 border-t border-secondary/10">
              <Button className="bg-primary-gradient border-none px-8 text-white shadow-lg shadow-primary/20 hover:opacity-90">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
