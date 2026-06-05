/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Claude "clay" orange accent
        accent: {
          50: '#fdf4ef',
          100: '#fbe6da',
          200: '#f6c8b3',
          300: '#efa585',
          400: '#e6835d',
          500: '#d97757', // primary
          600: '#c75f3e',
          700: '#a64a30',
          800: '#863e2b',
          900: '#6e3527',
        },
        // Warm near-black surfaces
        ink: {
          950: '#0b0a09',
          900: '#141210',
          850: '#1a1714',
          800: '#211d19',
          750: '#292420',
          700: '#352f29',
          600: '#463e36',
          500: '#5c524a',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(217,119,87,0.45), 0 8px 30px -6px rgba(217,119,87,0.55)',
        'glow-sm': '0 0 0 1px rgba(217,119,87,0.4), 0 4px 16px -4px rgba(217,119,87,0.45)',
        card: '0 16px 40px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'screen-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.995)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'ping-once': {
          '0%': { transform: 'scale(0.7)', opacity: '0.85' },
          '80%': { opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease both',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.2,0.7,0.2,1) both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.2,0.7,0.2,1) both',
        'screen-in': 'screen-in 0.45s cubic-bezier(0.2,0.7,0.2,1) both',
        'ping-once': 'ping-once 0.6s cubic-bezier(0,0,0.2,1) forwards',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
