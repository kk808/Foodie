/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compile the workspace packages' TypeScript source directly — no separate
  // watch/build step needed alongside `next dev` (build plan §4).
  transpilePackages: ["@foodie/ui", "@foodie/tokens"],
};

export default nextConfig;
