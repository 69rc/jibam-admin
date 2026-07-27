/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Jibam Navy ───────────────────────────────────
        navy: {
          50:  '#E8ECF8',
          100: '#C5CFEE',
          200: '#9BAADE',
          300: '#7185CE',
          400: '#4A62BE',
          500: '#2442AE',
          600: '#1A2E8A',
          700: '#0D1B5E',   // ← primary brand navy
          800: '#080F3A',
          900: '#040821',
        },
        // ── Jibam Cyan ───────────────────────────────────
        cyan: {
          50:  '#E0F5FD',
          100: '#B3E7FA',
          200: '#80D8F6',
          300: '#4DC8F2',
          400: '#26BCEF',
          500: '#00AEEF',   // ← primary brand cyan
          600: '#0090CC',
          700: '#0075A8',
          800: '#005985',
          900: '#003D5C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        xl:  '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
