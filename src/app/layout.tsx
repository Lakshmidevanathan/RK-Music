import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "RK Music — Class Resources",
  description: "Carnatic songs and raga outlines for music class",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} min-h-screen antialiased`}>
        <header
          className="shadow-md"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))",
          }}
        >
          <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-4 py-4">
            <Link
              href="/"
              className="justify-self-start text-lg font-semibold tracking-tight text-header-text"
            >
              <span className="text-accent-gold">RK</span> Music
            </Link>
            <p className="justify-self-center text-center text-sm font-semibold uppercase tracking-wide text-accent-gold sm:text-base md:text-lg">
              TEST SITE - UNDER DEVELOPMENT
            </p>
            <nav className="flex justify-self-end gap-6 text-sm font-medium">
              <Link
                href="/songs"
                className="text-header-text/90 transition-colors hover:text-accent-gold"
              >
                Carnatic Songs
              </Link>
              <Link
                href="/raga-outlines"
                className="text-header-text/90 transition-colors hover:text-accent-gold"
              >
                Raga Outlines
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mt-12 border-t border-border bg-card py-6 text-center text-sm text-muted-light">
          Music class resources
        </footer>
      </body>
    </html>
  );
}
