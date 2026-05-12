/**
 * Centralized site configuration.
 * All site-wide constants (social links, contact info, site metadata)
 * should be defined here to avoid hardcoding values in multiple places.
 */

export const siteConfig = {
  name: "Andreas Juon",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://andreasjuon.com",
  description: "Academic researcher, data scientist, and advisory services",
  email: "andreas.juon@unifr.ch",

  socialLinks: {
    github: "https://github.com/andreasjuon",
    scholar:
      "https://scholar.google.co.uk/citations?user=h7oFiP0AAAAJ&hl=de&oi=ao",
    twitter: "https://x.com/andijot",
    bluesky: "https://bsky.app/profile/andijot.bsky.social",
    dataverse: "https://dataverse.harvard.edu/dataverse/andreas_juon/",
  },
} as const;
