/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bricolage: ['Bricolage Grotesque', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        // Brand colors
        yellow: '#FFE033',
        'yellow-deep': '#F5C800',
        violet: '#6C2BD9',
        'violet-light': '#8B4FE8',
        'violet-pale': '#EDE6FF',
        pink: '#FF3CAC',
        mint: '#00E5C4',
        ink: '#120D1E',
        'ink-soft': '#2A2040',
        gray: '#8A8AA0',
        'light-gray': '#F0EEF8',
        // FIX: Added off-white
        'off-white': '#FAFAF7',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'spin-reverse': 'spin 12s linear infinite reverse',
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}