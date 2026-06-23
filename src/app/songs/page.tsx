import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SongsPageContent } from "@/components/SongsPageContent";
import { getSongs } from "@/lib/data";

export default function SongsPage() {
  const songs = getSongs();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Carnatic Songs" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold">Carnatic Songs</h1>
        <p className="mt-1 text-sm text-muted">
          Search by title or narrow results with the metadata filters.
        </p>
      </div>

      <SongsPageContent songs={songs} />
    </div>
  );
}
