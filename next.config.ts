import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // When assets move to a CMS, allow its host here, e.g.:
    // remotePatterns: [{ protocol: "https", hostname: "cms.eolo.com" }],
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);

// export default nextConfig;
