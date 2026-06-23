"use client";

import { useState } from "react";

type SongMetadataPanelProps = {
  summary: string;
  children: React.ReactNode;
};

export function SongMetadataPanel({ summary, children }: SongMetadataPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-border bg-card shadow-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left lg:hidden"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Song details
          </p>
          <p className="mt-0.5 truncate text-sm font-medium text-foreground-strong">
            {summary}
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted" aria-hidden>
          {open ? "Hide ▲" : "Show ▼"}
        </span>
      </button>

      <div
        className={
          open
            ? "grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border-light px-4 py-3 lg:border-t-0 lg:px-4 lg:py-3.5 lg:flex lg:flex-col lg:gap-4"
            : "hidden px-4 py-3.5 lg:flex lg:flex-col lg:gap-4"
        }
      >
        {children}
      </div>
    </section>
  );
}
