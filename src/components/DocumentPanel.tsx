"use client";

import { useState } from "react";
import { PdfEmbedViewer } from "@/components/PdfEmbedViewer";
import { displayFileLabel } from "@/lib/display";

export type DocumentItem = {
  id: string;
  label: string | null;
  publicUrl: string;
  kind: string;
};

function documentDisplayName(doc: DocumentItem): string {
  return displayFileLabel(doc.label ?? doc.kind);
}

export function DocumentPanel({ documents }: { documents: DocumentItem[] }) {
  const [selectedId, setSelectedId] = useState(documents[0]?.id ?? "");

  if (documents.length === 0) {
    return <p className="text-sm text-muted">No documents available.</p>;
  }

  const selected =
    documents.find((doc) => doc.id === selectedId) ?? documents[0];

  return (
    <div className="space-y-4">
      {documents.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {documents.map((doc) => {
            const isActive = doc.id === selected.id;
            const name = documentDisplayName(doc);
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => setSelectedId(doc.id)}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  isActive
                    ? "border-accent bg-card font-medium text-accent"
                    : "border-border bg-card text-foreground hover:border-accent"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      <PdfEmbedViewer
        key={selected.id}
        url={selected.publicUrl}
        title={documentDisplayName(selected)}
      />
    </div>
  );
}
