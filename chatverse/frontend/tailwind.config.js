/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors (Neon Accents)
        'primary-blue': '#00BFFF',
        'primary-purple': '#8A2BE2',
        'primary-pink': '#FF00FF',
        // Neutrals (Dark Mode Foundation)
        'bg-surface-glass': 'rgba(26, 27, 38, 0.5)',
        'bg-surface-solid': '#1A1B26',
        'text-primary': '#E4E4E7',
        'text-secondary': '#A0A0B0',
        'border-default': '#3A3A4A',
        // Semantic Colors
        'success': '#22C55E',
        'warning': '#F59E0B',
        'error': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '24px',
      },
      boxShadow: {
        'glow-blue': '0 0 16px rgba(0, 191, 255, 0.4)',
        'glow-purple': '0 0 16px rgba(138, 43, 226, 0.4)',
        'glow-pink': '0 0 16px rgba(255, 0, 255, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'glass': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(0, 191, 255, 0.4)' },
          '50%': { boxShadow: '0 0 24px rgba(0, 191, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
