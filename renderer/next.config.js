/** @type {import('next').NextConfig} */
module.exports = {
  devIndicators: {
    buildActivity: false,
  },
  output: 'export',
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}
