import type { NextConfig } from 'next';

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: '**.amazonaws.com'
  },
  {
    protocol: 'http',
    hostname: 'localhost'
  },
  {
    protocol: 'https',
    hostname: 'localhost'
  }
];

const publicMediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;

if (publicMediaBaseUrl) {
  try {
    const url = new URL(publicMediaBaseUrl);
    remotePatterns.push({
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port || undefined
    });
  } catch {
    // Ignore malformed values and keep the built-in S3/localhost patterns.
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns
  }
};

export default nextConfig;
