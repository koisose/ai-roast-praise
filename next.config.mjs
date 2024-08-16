/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: false, 
    typescript: {
        ignoreBuildErrors: true,
      },
      eslint: {
        ignoreDuringBuilds: true,
      },
      webpack: config => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.externals = config.externals || [];
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
      }
};

export default nextConfig;
