# Personal Website — Andreas Juon

Academic personal website for Andreas Juon (political scientist, University of Fribourg). Built with Next.js 14, deployed to GitHub Pages as a fully static site.

**Live site:** [andreasjuon.com](https://andreasjuon.com)

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 App Router (`output: 'export'` → static HTML) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Content | MDX (gray-matter + next-mdx-remote) |
| Validation | Zod v4 (schema-checked at build time) |
| Deployment | GitHub Actions → GitHub Pages |

---

## Project structure

```
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home: hero, featured carousel, social links
│   ├── about/page.tsx          # Portrait, CV download, affiliation timeline, 3-col block
│   ├── research/page.tsx       # Publications grouped by type
│   ├── data/page.tsx           # Datasets
│   ├── consulting/page.tsx     # Consulting services
│   ├── tools/page.tsx          # Tools list
│   ├── engagement/page.tsx     # Talks + media
│   ├── contact/page.tsx        # Contact info
│   └── <type>/[slug]/page.tsx  # Detail pages (projects, publications, datasets, …)
│
├── components/                 # React components
│   ├── Navbar.tsx              # Sticky top nav (desktop + mobile hamburger)
│   ├── PageContainer.tsx       # Max-width wrapper
│   ├── AboutBlock.tsx          # Home page hero text block
│   ├── AffiliationPanel.tsx    # Employment/education timeline panel
│   ├── AffiliationTimeline.tsx # Visual timeline within AffiliationPanel
│   ├── ContentCarousel.tsx     # Horizontal swipe carousel
│   ├── ContentGrid.tsx         # Responsive tile grid
│   ├── ContentList.tsx         # Vertical list wrapper
│   ├── ContentListItem.tsx     # Single list row
│   ├── ContentTile.tsx         # Card with image + metadata
│   ├── ContentDetail.tsx       # Shared detail page layout
│   ├── PublicationListItem.tsx # Publication-specific list row
│   ├── PublicationListByType.tsx  # Groups publications by type
│   ├── RecentUpdatesPanel.tsx  # News feed sidebar
│   ├── SocialLinks.tsx         # Social icon links
│   └── Figure.tsx              # Image component for MDX body content
│
├── content/                    # MDX content files
│   ├── affiliations.mdx        # Employment + education timeline (frontmatter-only)
│   ├── updates/                # News feed entries (JS array format, not frontmatter)
│   ├── projects/               # Research project pages
│   ├── publications/           # Academic publications
│   ├── datasets/               # Datasets
│   ├── tools/                  # Tools
│   ├── talks/                  # Conference talks
│   └── media/                  # Media appearances
│
├── lib/                        # Utilities
│   ├── types.ts                # ALL Zod schemas and TypeScript types
│   ├── content.ts              # MDX reader, validator, build-time cache
│   ├── siteConfig.ts           # Single source of truth: name, URL, email, socials
│   ├── layout.ts               # Shared Tailwind class constants
│   ├── contentPaths.ts         # Maps content type → URL segment
│   ├── metadata.ts             # SEO metadata helpers
│   ├── updates.ts              # Updates feed loader
│   ├── icons.tsx               # Shared icon utilities
│   └── typeColors.ts           # Content type → color mapping
│
├── scripts/
│   ├── validate-content.ts     # Pre-deploy content validator (run before committing)
│   └── import-from-wordpress.ts  # One-off WordPress import script
│
└── public/
    ├── images/                 # All images (portraits, publications, logos, …)
    │   └── logos/              # Institution logos for affiliation timeline
    └── cv_andreas_juon.pdf     # CV file linked from About page
```

---

## Content model

All content types share a **base frontmatter schema** (validated by Zod at build time):

### Required fields (all types)
```yaml
title: "…"
summary: "…"          # shown on cards/lists/carousels
tags: ["…"]
previewImage: "/images/…"   # path relative to public/; file must exist
```

### Optional fields (all types)
```yaml
date: "YYYY-MM-DD"    # or "YYYY" for publications
featured: 5           # int — higher number = more prominent on home carousel
externalLinks:
  paper: "…"
  code: "…"
  data: "…"
  demo: "…"
  website: "…"
relatedItems: ["slug1", "slug2"]   # slugs of any content type
```

### Publication-specific fields
```yaml
publicationType: peer-reviewed     # book | peer-reviewed | book-chapter | in-progress
authors: ["Andreas Juon", "…"]
year: "YYYY"
journal: "…"           # or booktitle + editors for book chapters
volume: "…"
number: "…"
status: under-review   # R&R | forthcoming | conditionally-accepted | under-review | first-draft | in-preparation
publicationLinks:
  pdf: "https://…"
  doi: "https://…"
  supplementary: "https://…"
relatedProjects: ["slug"]
relatedDatasets: ["slug"]
```

### Affiliations (`content/affiliations.mdx`)
Uses a custom schema (`AffiliationsFrontmatterSchema`). Top-level keys: `dataType: affiliations`, `employment: []`, `education: []`. See `lib/types.ts` for the full field list.

### Updates feed (`content/updates/*.mdx`)
These files export a JS array — **not** frontmatter:
```js
export const updates = [
  { id: 'YYYY-MM-DD-slug', date: 'YYYY-MM-DD', title: '…', summary: '…', href: '/…' },
]
```

---

## Adding content

1. Copy the `_TEMPLATE.mdx` from the appropriate `content/<type>/` directory.
2. Rename it following the slug convention (e.g. `juon2025_apsr.mdx`).
3. Fill in frontmatter; delete unused optional fields.
4. Add body text in Markdown. Use `<Figure>` for images.
5. Add any images to `public/images/`.
6. Run `npm run validate-content` and fix any errors.
7. Commit.

---

## Development workflow

```bash
npm install           # install dependencies
npm run dev           # start dev server at localhost:3000
npm run validate-content   # check frontmatter + image paths
npm run lint          # ESLint
npm run build         # static export → out/
```

### CI pipeline (`.github/workflows/`)
On push to `main`: ESLint → validate-content → Next.js build → deploy to GitHub Pages.

---

## Configuration

| File | Purpose |
|------|---------|
| `lib/siteConfig.ts` | Name, URL, email, social links — edit here only |
| `next.config.js` | `basePath`, `assetPrefix` for GitHub Pages subdirectory deploys |
| `tailwind.config.ts` | Color palette, typography |
| `tsconfig.json` | TypeScript paths (`@/*` → project root) |

**Environment variables:**
- `NEXT_PUBLIC_SITE_URL` — canonical site URL for SEO metadata
- `GITHUB_PAGES_BASE_PATH` — repo name prefix for GitHub project site deploys (auto-set by CI)

---

## Security

MDX files are compiled and executed at **build time** by `next-mdx-remote`. This is safe as long as all content is authored by the site owner and committed to the repository. Do not accept untrusted MDX content contributions without switching to a sandboxed renderer.

---

## License

MIT
