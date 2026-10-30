/** Static export so it deploys to Vercel (or any static host) with no server. */
const nextConfig = { output: "export", trailingSlash: true, images: { unoptimized: true }, reactStrictMode: true };
export default nextConfig;
