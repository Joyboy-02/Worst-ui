/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'toxic-green': '#00ff41',
        'hostile-pink': '#ff007f',
        'dread-yellow': '#ffff00',
        'cyan-burn': '#00ffff',
        'blood-orange': '#ff3300',
        'cursed-purple': '#bf00ff',
      },
      fontFamily: {
        comic: ['"Comic Sans MS"', '"Comic Neue"', 'cursive', 'sans-serif'],
        terminal: ['"VT323"', '"Courier New"', 'monospace'],
        papyrus: ['Papyrus', 'fantasy', 'serif'],
        impact: ['Impact', 'Haettenschweiler', 'sans-serif'],
      },
      animation: {
        'strobe-fast': 'strobe 0.15s infinite',
        'strobe-slow': 'strobe 0.6s infinite',
        'jitter': 'jitter 0.2s infinite',
        'marquee': 'marquee 12s linear infinite',
        'marquee-reverse': 'marqueeRev 10s linear infinite',
        'flicker': 'flicker 0.1s infinite',
      },
      keyframes: {
        strobe: {
          '0%, 100%': { opacity: '1', backgroundColor: '#ff0000' },
          '50%': { opacity: '0.2', backgroundColor: '#00ffff' },
        },
        jitter: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(-3px, 2px) rotate(-1deg)' },
          '50%': { transform: 'translate(2px, -3px) rotate(1.5deg)' },
          '75%': { transform: 'translate(-2px, -2px) rotate(-0.5deg)' },
          '100%': { transform: 'translate(3px, 1px) rotate(0.5deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marqueeRev: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        flicker: {
          '0%': { opacity: '0.97' },
          '50%': { opacity: '1' },
          '80%': { opacity: '0.85' },
          '100%': { opacity: '0.99' },
        }
      }
    },
  },
  plugins: [],
}
