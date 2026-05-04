/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // tribe palette
        bg: {
          DEFAULT: '#0d0a14',
          card: '#161020',
          elevated: '#1f1830',
        },
        accent: {
          DEFAULT: '#a78bfa', // purple
          pink: '#ec4899',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#eab308',
        },
        text: {
          DEFAULT: '#ffffff',
          muted: '#9ca3af',
          dim: '#6b7280',
        },
        border: {
          DEFAULT: '#2a2235',
          strong: '#3a3045',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
