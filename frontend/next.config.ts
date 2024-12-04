import type { NextConfig } from "next";

const nextConfig: NextConfig = {
//     백엔드 서버에서 이미지 파일을 가져오기 위한 설정
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
        pathname: '/file/**',
      },
    ],
  },
};

export default nextConfig;