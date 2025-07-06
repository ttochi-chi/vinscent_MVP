import localFont from 'next/font/local'

// Pretendard 가변 폰트 설정
export const pretendard = localFont({
  src: [
    {
      path: '../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
      weight: '45 920',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont', 
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'sans-serif'
  ],
})

export const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
} as const

export type FontWeight = keyof typeof fontWeights