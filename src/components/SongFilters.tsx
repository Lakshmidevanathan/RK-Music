"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import type { FilterOptions } from "@/lib/song-filters";

const FILTER_PARAMS = [
  { key: "composer", label: "Composer" },
  { key: "ragam", label: "Raagam" },
  { key: "taalam", label: "Taalam" },
  { key: "songType", label: "Song Type" },
  { key: "language", label: "Language" },
  { key: "deity", label: "Deity" },
] as const;

type FilterKey = (typeof FILTER_PARAMS)[number]["key"];

function FilterSection({
  label,
  paramName,
  options,
  current,
  onSelect,
}: {
  label: string;
  paramName: FilterKey;
  options: string[];
  current: string | null;
  onSelect: (paramName: FilterKey, value: string | null) => void;
}) {
  const [open, setOpen] = useState(Boolean(current));

  if (options.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 rounded-md px-1 py-0.5 text-left transition hover:bg-card-hover"
        aria-expanded={open}
      >
        <span className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-accent">
          {label}
          {current ? (
            <span className="normal-case text-foreground-strong">
              {" "}
              · {current}
            </span>
          ) : null}
        </span>
        <span className="shrink-0 text-xs text-muted" aria-hidden>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open ? (
        <ul className="mt-2 space-y-0.5">
          {options.map((option) => {
            const active = current === option;
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => onSelect(paramName, active ? null : option)}
                  className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition ${
                    active
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-foreground-strong hover:bg-card-hover"
                  }`}
                  aria-pressed={active}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function SongFilters({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setFilter = useCallback(
    (paramName: FilterKey, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(paramName, value);
      else params.delete(paramName);
      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const { key } of FILTER_PARAMS) {
      params.delete(key);
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [router, searchParams]);

  const hasFilters = FILTER_PARAMS.some(
    ({ key }) => searchParams.get(key) !== null,
  );

  const visibleSections = FILTER_PARAMS.filter(
    ({ key }) => options[key].length > 0,
  );

  if (visibleSections.length === 0) return null;

  return (
    <nav
      className="space-y-3 rounded-xl border border-border bg-card px-3 py-4 shadow-md"
      aria-label="Song filters"
      aria-busy={isPending}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Filter by
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-muted transition hover:text-accent"
          >
            Clear
          </button>
        )}
      </div>

      {visibleSections.map(({ key, label }) => (
        <FilterSection
          key={key}
          label={label}
          paramName={key}
          options={options[key]}
          current={searchParams.get(key)}
          onSelect={setFilter}
        />
      ))}
    </nav>
  );
}
