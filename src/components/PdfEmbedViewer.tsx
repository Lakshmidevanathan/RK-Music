"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.15;

type PdfEmbedViewerProps = {
  url: string;
  title: string;
};

export function PdfEmbedViewer({ url, title }: PdfEmbedViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(640);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const padding = 32;
      setPageWidth(Math.max(280, el.clientWidth - padding));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onLoadSuccess = useCallback(({ numPages: pages }: { numPages: number }) => {
    setNumPages(pages);
    setLoading(false);
    setError(null);
  }, []);

  const onLoadError = useCallback(() => {
    setLoading(false);
    setError("Could not load this PDF in the viewer.");
  }, []);

  const scaledWidth = Math.round(pageWidth * zoom);
  const downloadName = decodeURIComponent(
    url.split("/").pop() ?? "document.pdf",
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-accent-soft/40 px-3 py-2">
        <p className="truncate text-sm font-semibold text-accent">{title}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
            className="rounded-md border border-border px-2 py-1 text-sm hover:border-accent"
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="min-w-12 text-center text-xs text-muted">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
            className="rounded-md border border-border px-2 py-1 text-sm hover:border-accent"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:border-accent"
          >
            Reset
          </button>
          <a
            href={url}
            download={downloadName}
            className="rounded-md border border-border px-2 py-1 text-xs text-accent hover:border-accent"
          >
            Download
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-2 py-1 text-xs text-accent hover:border-accent"
          >
            New tab
          </a>
        </div>
      </div>

      <div
        ref={containerRef}
        className="max-h-[70vh] overflow-y-auto bg-surface px-4 py-4"
      >
        {error ? (
          <p className="py-8 text-center text-sm text-muted">{error}</p>
        ) : (
          <Document
            key={url}
            file={url}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={
              <p className="py-12 text-center text-sm text-muted">Loading PDF…</p>
            }
            className="flex flex-col items-center gap-4"
          >
            {loading && numPages === 0 ? null : (
              Array.from({ length: numPages }, (_, index) => (
                <Page
                  key={`${url}-page-${index + 1}`}
                  pageNumber={index + 1}
                  width={scaledWidth}
                  className="shadow-md"
                  renderTextLayer
                  renderAnnotationLayer
                />
              ))
            )}
          </Document>
        )}
      </div>

      {!loading && !error && numPages > 0 && (
        <p className="border-t border-border px-3 py-2 text-center text-xs text-muted">
          {numPages} {numPages === 1 ? "page" : "pages"} — scroll to read
        </p>
      )}
    </div>
  );
}
