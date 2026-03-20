import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'garden-bucket-test-0x2222.s3.us-east-1.amazonaws.com', // Replace with your actual bucket hostname
        port: '',
        pathname: '/**', // Allows all paths within the bucket
      }
    ],
  },

};

export default nextConfig;
