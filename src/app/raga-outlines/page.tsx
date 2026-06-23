import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RagaOutlinesPageContent } from "@/components/RagaOutlinesPageContent";
import { getRagaOutlines } from "@/lib/data";

export default function RagaOutlinesPage() {
  const outlines = getRagaOutlines();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Raga Outlines" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold">Raga Outlines</h1>
        <p className="mt-1 text-sm text-muted">
          Swara singing outlines for each raga.
        </p>
      </div>

      <RagaOutlinesPageContent outlines={outlines} />
    </div>
  );
}
