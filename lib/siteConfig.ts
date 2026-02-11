/**
 * Centralized site configuration.
 * All site-wide constants (social links, contact info, site metadata)
 * should be defined here to avoid hardcoding values in multiple places.
 */

export const siteConfig = {
  name: 'Andreas Juon',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://andreasjuon.com',
  description: 'Academic researcher, data scientist, and advisory services',
  email: 'contact@andreasjuon.com',

  socialLinks: {
    github: 'https://github.com/andreasjuon',
    scholar: 'https://scholar.google.com/citations?user=YOUR_ID',
    twitter: 'https://twitter.com/andreasjuon',
  },
} as const
