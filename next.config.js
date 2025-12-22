/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *; frame-src *; child-src *; default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *;",
          },
        ],
      },
    ];
  }
}

module.exports = nextConfig
