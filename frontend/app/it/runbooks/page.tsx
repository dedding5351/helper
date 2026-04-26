"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RunbookService, Runbook } from "../services/runbook.service";

export default function RunbooksPage() {
  const [runbooks, setRunbooks] = useState<Runbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRunbooks() {
      setLoading(true);
      try {
        const response = await RunbookService.getRunbooks();
        setRunbooks(response.data);
      } catch (error) {
        console.error("Failed to load runbooks", error);
      } finally {
        setLoading(false);
      }
    }
    loadRunbooks();
  }, []);
  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex h-20 shrink-0 items-center justify-between px-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
          Runbooks
        </h1>
        <Button className="bg-primary-gradient border-none text-white shadow-lg shadow-primary/20 hover:opacity-90">
          Create Runbook
        </Button>
      </header>

      {/* Grid Content */}
      <main className="flex-1 overflow-auto px-8 pb-12 pt-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <span className="text-muted-foreground text-sm">Loading runbooks...</span>
          </div>
        ) : runbooks.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <span className="text-muted-foreground text-sm">No runbooks available.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {runbooks.map((rb) => (
            <div
              key={rb.id}
              className="group flex cursor-pointer flex-col justify-between rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(44,52,55,0.05)]"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {rb.id}
                  </span>
                  {rb.status === "Deprecated" && (
                    <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground">
                      Deprecated
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-xl font-bold leading-snug tracking-tight text-foreground group-hover:text-primary">
                  {rb.title}
                </h3>
                <p className="text-xs font-medium text-muted-foreground/80">
                  Maintained by {rb.author}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {rb.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-outline-variant/10 bg-surface px-2 py-1 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        )}
      </main>
    </div>
  );
}
