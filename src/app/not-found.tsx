import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 text-center py-12">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-muted text-sm">This page does not exist.</p>
      <Link href="/" className="text-accent hover:underline text-sm">
        Back to home
      </Link>
    </div>
  );
}
