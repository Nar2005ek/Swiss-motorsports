/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/apply-now",
        destination: "/apply",
        permanent: true,
      },
      {
        source: "/lease-specials",
        destination: "/specials",
        permanent: true,
      },
      {
        source: "/special-offers",
        destination: "/specials",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
