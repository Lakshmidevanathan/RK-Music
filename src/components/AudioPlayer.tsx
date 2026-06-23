"use client";

import { displayFileLabel } from "@/lib/display";

type Track = {
  id: string;
  label: string;
  publicUrl: string;
};

function TrackRow({ track }: { track: Track }) {
  const label = displayFileLabel(track.label);

  return (
    <div className="flex flex-row items-center gap-2 px-3 py-2 sm:gap-3">
      <p
        className="w-24 shrink-0 truncate text-sm font-semibold text-accent sm:w-28 lg:w-32"
        title={label}
      >
        {label}
      </p>
      <div className="min-w-0 flex-1">
        <audio
          controls
          preload="metadata"
          className="audio-player w-full max-w-full"
          src={track.publicUrl}
        >
          Your browser does not support audio playback.
        </audio>
      </div>
    </div>
  );
}

export function AudioPlayer({ tracks }: { tracks: Track[] }) {
  if (tracks.length === 0) {
    return (
      <p className="text-sm text-muted">No recordings available.</p>
    );
  }

  if (tracks.length === 1) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-md">
        <TrackRow track={tracks[0]} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
      <div className="max-h-80 divide-y divide-border-light overflow-y-auto overscroll-y-contain">
        {tracks.map((track) => (
          <TrackRow key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
