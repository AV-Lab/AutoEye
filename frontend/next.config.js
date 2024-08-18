/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src", "playwright-tests"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/sign-in", // Adjust this if your sign-in page has a different path
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
