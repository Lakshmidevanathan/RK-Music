"use client";

import Link from "next/link";
import { useState } from "react";
import { parseSimilarLinks, type SimilarLink } from "@/lib/json";

type RelatedLinksProps = {
  json: string;
  /** Match metadata fields in the top row of the metadata card. */
  row?: boolean;
  /** Start collapsed; expand to show links. */
  collapsible?: boolean;
  /** Compact pill buttons when expanded. */
  pills?: boolean;
};

const labelClassName =
  "inline-block rounded-full bg-accent-soft py-0.5 pr-2.5 text-xs font-semibold uppercase tracking-wide text-accent";

const pillClassName =
  "inline-flex max-w-full items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground-strong transition hover:border-accent hover:text-accent";

export function RelatedLinks({
  json,
  row = false,
  collapsible = false,
  pills = false,
}: RelatedLinksProps) {
  const links = parseSimilarLinks(json);
  const [open, setOpen] = useState(false);

  if (links.length === 0) return null;

  const countLabel = `${links.length} link${links.length === 1 ? "" : "s"}`;

  const linkList = (
    <ul className={pills ? "flex flex-wrap gap-2" : "space-y-1"}>
      {links.map((link, i) => (
        <li key={i} className={pills ? "min-w-0 max-w-full" : "min-w-0"}>
          <RelatedLinkItem link={link} pills={pills} />
        </li>
      ))}
    </ul>
  );

  if (row) {
    return (
      <div className="min-w-0 shrink-0 text-left">
        {collapsible ? (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`${labelClassName} cursor-pointer transition hover:opacity-80`}
              aria-expanded={open}
            >
              Related Links
            </button>
            <div className="mt-1.5">
              {open ? (
                <div className="space-y-2">
                  {linkList}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-xs font-medium text-muted hover:text-accent"
                  >
                    Hide
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="text-sm font-medium text-foreground-strong hover:text-accent"
                >
                  {countLabel} ›
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className={labelClassName}>Related Links</p>
            <div className="mt-1.5">{linkList}</div>
          </>
        )}
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Related Links</h2>
      {linkList}
    </section>
  );
}

/** @deprecated Use RelatedLinks */
export const SimilarLinks = RelatedLinks;

function RelatedLinkItem({
  link,
  pills,
}: {
  link: SimilarLink;
  pills: boolean;
}) {
  const label = link.label ?? link.songSlug ?? link.url;
  const className = pills
    ? `${pillClassName} truncate`
    : "block text-sm font-medium text-foreground-strong break-words hover:text-accent hover:underline";

  if (link.songSlug) {
    return (
      <Link href={`/songs/${link.songSlug}`} className={className} title={label}>
        {label}
      </Link>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={label}
    >
      {label}
    </a>
  );
}
