const withPWA = require("next-pwa")({
  dest: "public",
  // For PWA Updater
  skipWaiting: false,
  register: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
