/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화 설정
  images: {
    domains: [
      'localhost',
      'via.placeholder.com', // 테스트용
      'res.cloudinary.com',  // Cloudinary
      'images.unsplash.com', // Unsplash (테스트용)
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 실험적 기능 (필요한 경우)
  experimental: {
    // App Router 관련 설정
  },
  
  // 환경 변수
  env: {
    NEXT_PUBLIC_APP_NAME: 'Vinscent MVP',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
}

module.exports = nextConfig