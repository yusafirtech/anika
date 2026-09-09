import type { NextConfig } from "next";

// Allow next/image to load admin-uploaded images, which are served by the
// backend (MySQL-backed media store) at NEXT_PUBLIC_API_ORIGIN/api/media/*.
const backendOrigin = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_ORIGIN ||
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:5000");
  }
})();

// Loopback/private hostnames used for local development. Next.js 16 blocks
// image optimization for these by default (SSRF protection) — that's the
// right default for production, but the backend runs on one of these during
// local dev, so it needs to be explicitly allowed only in that case.
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);
const isLocalBackend = LOCAL_HOSTNAMES.has(backendOrigin.hostname);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: backendOrigin.protocol.replace(":", "") as "http" | "https",
        hostname: backendOrigin.hostname,
        port: backendOrigin.port,
        pathname: "/api/media/**",
      },
    ],
    ...(isLocalBackend ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default nextConfig;
