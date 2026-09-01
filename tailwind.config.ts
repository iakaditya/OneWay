import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // OneWay Design System
        background: '#0e1012',
        surface: '#1a1d21',
        'surface-2': '#22262c',
        'surface-3': '#2a2f37',
        border: '#2e333b',
        'border-subtle': '#232830',

        // Typography
        'text-primary': '#f0f0ee',
        'text-secondary': '#9aa0ab',
        'text-muted': '#5a6170',

        // Risk colors
        'risk-low': '#22c55e',
        'risk-moderate': '#f59e0b',
        'risk-high': '#ef4444',
        'risk-critical': '#dc2626',

        // Brand
        accent: '#6366f1',
        'accent-hover': '#4f46e5',

        // Route
        route: '#3b82f6',
        'route-alt': '#8b5cf6',

        // Status
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero':
          'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, rgba(14,16,18,0) 70%)',
        'gradient-card':
          'linear-gradient(135deg, rgba(34,38,44,0.8) 0%, rgba(26,29,33,0.9) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5)',
        'glow-green': '0 0 20px rgba(34,197,94,0.2)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.2)',
        'glow-red': '0 0 20px rgba(239,68,68,0.2)',
        'glow-accent': '0 0 30px rgba(99,102,241,0.3)',
      },
      borderRadius: {
        'xl2': '1rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
