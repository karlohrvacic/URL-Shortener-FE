/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    // Proxy API and OAuth2 calls to the backend during development to avoid CORS.
    // Production uses the same origin (hrva.cc), so no rewrite needed.
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/v1/:path*",
          destination: "http://localhost:8080/api/v1/:path*",
        },
        {
          source: "/oauth2/:path*",
          destination: "http://localhost:8080/oauth2/:path*",
        },
        {
          source: "/login/:path*",
          destination: "http://localhost:8080/login/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
