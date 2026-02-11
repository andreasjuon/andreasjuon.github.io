/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Required when deployed to GitHub Pages project site (username.github.io/REPO_NAME/)
  // Set GITHUB_PAGES_BASE_PATH to your repo name, or leave unset for root deployment
  basePath: process.env.GITHUB_PAGES_BASE_PATH || '',
  assetPrefix: process.env.GITHUB_PAGES_BASE_PATH || '',
  trailingSlash: true,
}

module.exports = nextConfig
