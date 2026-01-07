/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_BACK_END + '/api/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000/',
    NEXT_PUBLIC_BACK_END: process.env.NEXT_PUBLIC_BACK_END || 'http://localhost:5000/',
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibmFtZXZveTEyMyIsImEiOiJjbTkyemt2cmowYWM5MndzNDZ5eDN2d3B1In0.v7kTe6KFT0ikRTqYngqQyg'
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_BACK_END?.replace('https://', '') || 'localhost',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
