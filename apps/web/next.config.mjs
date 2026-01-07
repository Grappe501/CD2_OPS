/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
    externalDir: true
  },
  transpilePackages: ["@cd2/core", "@cd2/db"],
};

export default nextConfig;
