/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        '8xl': '90rem',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },

      fontFamily: {
        sans: ['"Kyiv Type Sans"', 'system-ui', 'sans-serif'],
        kyiv: ['"Kyiv Type Sans"', 'sans-serif'],
      },

      fontSize: {
        h1m: ['18px', { lineHeight: 1.2, fontWeight: 300 }],
        h2m: ['20px', { lineHeight: 1.25, fontWeight: 500 }],
        h3m: ['18px', { lineHeight: 1.3, fontWeight: 500 }],
        h4m: ['16px', { lineHeight: 1.4, fontWeight: 500 }],
        h5m: ['14px', { lineHeight: 1.5, fontWeight: 700 }],
        h6m: ['14px', { lineHeight: 1.45, fontWeight: 400 }],
        buttonm: ['16px', { lineHeight: 1.4, fontWeight: 500 }],
        paragraphm: ['14px', { lineHeight: 1.45, fontWeight: 400 }],
        tagm: ['14px', { lineHeight: 1.4, fontWeight: 200 }],
        captionm: ['12px', { lineHeight: 1.5, fontWeight: 300 }],
      },
      accentColor: {
        'gray-600': '#4B5563',
        'gray-800': '#1F2937',
      },
    },
  },
  plugins: [],
};
