# RK Music

A website for music class resources: **Carnatic Songs** and **Raga Outlines**.

## Content folders

| Folder | Purpose |
|--------|---------|
| `Songs/` | One subfolder per song — audio recordings (mp3/m4a) and PDFs |
| `Raga Outlines/` | One audio file per raga (`{Raga} Outline.mp3`) |

Optional per-song metadata in `Songs/<Song Name>/metadata.yaml`:

```yaml
title: Devi Neeye
composer: Tyagaraja
ragams: [Keeravani]
taalam: Adi
songType: Krithi
language: Sanskrit
deity: Siva
similarSongLinks:
  - label: Reference on YouTube
    url: https://youtube.com/...
documents:
  - file: 20190228-BantuReethi-Hamsanadam-Adi-Notation.pdf
    kind: notation
    rotateToPortrait: true   # landscape scan → portrait in public/media
```

Set `rotatePdfsToPortrait: true` on the song to apply to all PDFs in that folder, or set `rotateToPortrait: true` per document. Use `rotation: 90` or `rotation: -90` if the auto rotation needs a tweak.

## Setup

```bash
npm install
cp .env.example .env   # if .env missing
npm run db:push
npm run import
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Do not run** `npm audit fix --force` — it can downgrade Next.js and break the app.

**Windows ARM (Surface etc.):** This project uses Prisma’s SQLite driver adapter (no x64 query engine). Use Node 22 LTS.

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run import` | Scan `Songs/` and `Raga Outlines/`, copy media to `public/media/`, update database |
| `npm run db:push` | Apply Prisma schema to SQLite |
| `npm run build` | Production build |

## Adding new content

1. Add files under `Songs/<New Song>/` or `Raga Outlines/`.
2. Optionally add `metadata.yaml` for composer, similar links.
3. Run `npm run import`.
4. Refresh the site.

## Production

- Set `DATABASE_URL` to PostgreSQL (change `provider` in `prisma/schema.prisma` to `postgresql`).
- Configure R2/S3 env vars and extend `scripts/import.ts` to upload to cloud storage instead of `public/media/`.
- Deploy to Vercel.

## Tech stack

- Next.js 15, React 19, Tailwind CSS 4
- Prisma + SQLite (local) / PostgreSQL (production)
- Import script copies media locally; CDN-ready structure for production
