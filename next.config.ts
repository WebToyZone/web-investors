import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_CDN_URL
      ? [
          {
            protocol: 'https' as const,
            hostname: new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname,
          },
        ]
      : [],
  },
};

export default withNextIntl(nextConfig);

// export default nextConfig;
