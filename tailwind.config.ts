import type {Config} from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        headline: ['Inter', 'system-ui', 'sans-serif'],
        code: ['Source Code Pro', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)',
          shadow: 'var(--glass-shadow)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: 'calc(var(--radius) - 6px)',
        '2xl': '1.25rem', 
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [
    animatePlugin,
    function({ addUtilities, theme, e }: { addUtilities: any, theme: any, e: (str: string) => string }) {
      const blurUtilities = {
        '.backdrop-blur-xs': {
          '--tw-backdrop-blur': 'blur(2px)',
          backdropFilter: 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
        },
        '.backdrop-blur-sm': {
          '--tw-backdrop-blur': 'blur(4px)',
          backdropFilter: 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
        },
        '.backdrop-blur-md': {
          '--tw-backdrop-blur': 'blur(8px)',
          backdropFilter: 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
        },
        '.backdrop-blur-lg': {
          '--tw-backdrop-blur': 'blur(12px)',
          backdropFilter: 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
        },
        '.backdrop-blur-xl': {
          '--tw-backdrop-blur': 'blur(16px)',
          backdropFilter: 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
        },
        '.backdrop-blur-2xl': {
          '--tw-backdrop-blur': 'blur(24px)',
          backdropFilter: 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
        }
      };

      addUtilities(blurUtilities, {
        variants: ['responsive', 'hover', 'focus'],
      });

      const glassUtilities = {
        '.glass-sm': {
          '--glass-bg': 'rgba(255, 255, 255, 0.05)',
          '--glass-border': '1px solid rgba(255, 255, 255, 0.1)',
          '--glass-shadow': '0 4px 16px rgba(0, 0, 0, 0.05)'
        },
        '.glass': {
          '--glass-bg': 'rgba(255, 255, 255, 0.1)',
          '--glass-border': '1px solid rgba(255, 255, 255, 0.15)',
          '--glass-shadow': '0 8px 32px rgba(31, 38, 135, 0.15)'
        },
        '.glass-lg': {
          '--glass-bg': 'rgba(255, 255, 255, 0.15)',
          '--glass-border': '1px solid rgba(255, 255, 255, 0.2)',
          '--glass-shadow': '0 16px 48px rgba(0, 0, 0, 0.12)'
        },
        '.glass-xl': {
          '--glass-bg': 'rgba(255, 255, 255, 0.2)',
          '--glass-border': '1px solid rgba(255, 255, 255, 0.25)',
          '--glass-shadow': '0 24px 64px rgba(0, 0, 0, 0.18)'
        },
        '.glass-inner': {
          '--glass-bg': 'rgba(255, 255, 255, 0.05)',
          '--glass-border': '1px solid rgba(255, 255, 255, 0.1)',
          '--glass-shadow': 'inset 0 2px 8px rgba(255, 255, 255, 0.1)'
        }
      };

      addUtilities(glassUtilities, {
        variants: ['responsive', 'hover', 'focus'],
      });
    },
  ],
} satisfies Config;
