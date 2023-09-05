/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  apiHeaders: {
    'Content-Length': 10 * 1024 * 1024, // 10MB
  },
}

module.exports = nextConfig
