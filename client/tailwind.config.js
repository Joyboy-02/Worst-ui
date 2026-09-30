/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forester-dark': '#141c14',
        'peat-dark': '#1d1712',
        'bureau-green': '#2d4a30',
        'officer-moss': '#3e5838',
        'parchment-drab': '#e2ded4',
        'parchment-muted': '#c8c2b3',
        'lichen-stone': '#829180',
        'soil-umber': '#453326',
        'dry-bark': '#5c4533',
        'regulatory-gold': '#b89438',
        'warning-rust': '#a8422b',
        'subdued-fern': '#4f7251',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['"Share Tech Mono"', '"Courier New"', 'Courier', 'monospace'],
        display: ['"Book Antiqua"', 'Palatino', 'Georgia', 'serif'],
      },
      animation: {
        'bureau-shift': 'shift 12s infinite',
        'subtle-buzz': 'buzz 0.1s infinite',
        'slow-marquee': 'marquee 22s linear infinite',
      },
      keyframes: {
        shift: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.998)' },
        },
        buzz: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(0.5px, -0.5px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
