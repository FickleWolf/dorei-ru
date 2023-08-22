/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ja'],
    defaultLocale: 'ja',
  },
  reactStrictMode: false,
  basePath: '',
  images: {
    unoptimized: true,
    domains: ['ficklewolf.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
