# Personal Website - Next.js Implementation

A content-driven, modular personal website built with Next.js, showcasing academic research, data science work, and consulting services.

## Features

- **Static Site Generation**: Fully static site optimized for GitHub Pages deployment
- **Content-Driven**: MDX/Markdown content with structured frontmatter
- **Multiple Layout Modes**: Content can be displayed as tiles, horizontal lists, or detail pages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Metadata, Open Graph tags, and sitemap generation
- **Type-Safe**: Full TypeScript support

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- MDX/Markdown content
- React Icons

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── research/          # Research page
│   ├── data/              # Datasets page
│   ├── consulting/        # Consulting page
│   ├── tools/             # Tools page
│   ├── engagement/        # Public engagement page
│   ├── contact/           # Contact page
│   ├── projects/[slug]/   # Project detail pages
│   ├── publications/[slug]/ # Publication detail pages
│   ├── datasets/[slug]/   # Dataset detail pages
│   ├── tools/[slug]/      # Tool detail pages
│   ├── talks/[slug]/      # Talk detail pages
│   └── media/[slug]/      # Media detail pages
├── components/            # React components
│   ├── ContentTile.tsx    # Rectangular card component
│   ├── ContentListItem.tsx # Horizontal list item component
│   ├── ContentGrid.tsx    # Grid wrapper
│   ├── ContentCarousel.tsx # Carousel component
│   ├── ContentDetail.tsx  # Shared content detail view
│   ├── Navbar.tsx         # Navigation bar
│   └── ...
├── content/               # MDX content files
│   ├── projects/
│   ├── publications/
│   ├── datasets/
│   ├── tools/
│   ├── talks/
│   └── media/
├── lib/                   # Utility functions
│   ├── types.ts           # Zod schemas and TypeScript types
│   ├── content.ts         # Content collection utilities
│   ├── metadata.ts        # SEO metadata utilities
│   ├── siteConfig.ts      # Centralized site configuration
│   ├── icons.tsx          # Shared icon utilities
│   └── typeColors.ts      # Content type color mapping
├── scripts/               # Build and validation scripts
│   └── validate-content.ts # Content validation (frontmatter, images, links)
└── public/                # Static assets
    └── images/
```

## Content Model

Each content item (project, publication, dataset, tool, talk, media) follows a standardized schema:

### Required Fields
- `title`: Content title
- `type`: Content type (project | publication | dataset | tool | talk | media)
- `summary`: Short description
- `tags`: Array of tags
- `previewImage`: Path to preview image

### Optional Fields
- `date`: Publication/creation date
- `externalLinks`: Object with paper, code, data, demo, website links
- `relatedItems`: Array of slugs of related items

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Start production server:
```bash
npm start
```

## Adding Content

1. Create a new `.mdx` file in the appropriate content directory (`content/projects/`, `content/publications/`, etc.)
2. Add frontmatter with required fields
3. Write content in Markdown below the frontmatter
4. Add preview images to `public/images/`

Example:

```mdx
---
title: "My Project"
type: project
summary: "A brief description of the project"
tags: ["research", "data science"]
previewImage: "/images/my-project.png"
date: "2024-01-01"
externalLinks:
  code: "https://github.com/username/repo"
---

# My Project

Full project description in Markdown...
```

## Deployment

### GitHub Pages

1. Push code to GitHub repository
2. GitHub Actions will automatically build and deploy on push to `main` branch
3. Configure GitHub Pages settings to use GitHub Actions as source

### Custom Domain

Update `next.config.js` to set `basePath` if deploying to a subdirectory, or remove it for root domain deployment.

## Content Validation

Run the content validation script to check for common issues before deploying:

```bash
npm run validate-content
```

This checks for:
- **Frontmatter schema violations**: Missing required fields (title, summary, tags, previewImage)
- **Placeholder content**: Detects markers like `YOUR_ID`, `example.com`, `[Your ...`
- **Broken image paths**: Ensures `previewImage` values resolve to files in `public/`
- **Broken related items**: Ensures `relatedItems` slugs reference existing content

The validation script also runs automatically in CI before the build step.

## Configuration

- **Site Config**: Centralized site constants (name, URL, email, social links) in `lib/siteConfig.ts`
- **Base Path**: Configure in `next.config.js` if deploying to subdirectory
- **Site URL**: Set `NEXT_PUBLIC_SITE_URL` environment variable for SEO metadata
- **Colors**: Customize in `tailwind.config.ts`
- **Content Types**: Add new types in `lib/types.ts` and update content utilities

## Security Notes

### MDX Content Trust Boundary

Content is rendered using `MDXRemote` from `next-mdx-remote/rsc`, which compiles and executes MDX at build time. MDX files can contain arbitrary JavaScript expressions and JSX components. This is safe as long as:

- **All content files are authored by trusted contributors** (i.e., the site owner)
- **Content files are committed to the repository** and reviewed before merge

**If the repository ever accepts content contributions from untrusted sources** (e.g., open pull requests from external contributors), MDX rendering becomes a potential code execution vector. In that case, consider:

1. Switching to a plain Markdown renderer (e.g., `react-markdown`) that does not execute code
2. Adding a sandboxed build environment for untrusted PRs
3. Implementing strict Content Security Policy headers

## License

MIT
