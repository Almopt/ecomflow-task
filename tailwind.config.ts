import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors based on ecomflow - updated with both dark and light UI
        background: '#FFFFFF', // Default to white background
        foreground: '#1A1A1A', // Default text color

        card: {
          DEFAULT: '#FFFFFF', // White cards
          foreground: '#1A1A1A', // Dark text in cards
        },

        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A1A',
        },

        primary: {
          DEFAULT: '#34B53A', // Bright green from logo
          foreground: '#FFFFFF', // White text
        },

        secondary: {
          DEFAULT: 'rgba(52, 181, 58, 0.1)', // Light green background for tags
          foreground: '#34B53A', // Green text
        },

        muted: {
          DEFAULT: '#F5F5F5', // Light gray background
          foreground: '#666666', // Muted text color
        },

        accent: {
          DEFAULT: '#34B53A', // Bright green accent
          foreground: '#FFFFFF', // White text
        },

        destructive: {
          DEFAULT: '#FF4747', // Red for destructive actions
          foreground: '#FFFFFF', // White text
        },

        border: '#E5E5E5', // Light border color
        input: '#F5F5F5', // Light input background
        ring: '#34B53A', // Focus rings in bright green

        // Chart colors adapted to ecomflow palette
        chart: {
          '1': '#34B53A', // Bright green
          '2': '#CCCCCC', // Light gray
          '3': '#F87171', // Red
          '4': '#FCD34D', // Yellow
          '5': '#60A5FA', // Blue
        },

        // Ecomflow specific colors - comprehensive set from all images
        ecomflow: {
          // Green palette
          'green-dark': '#052208', // Dark green background
          'green-primary': '#34B53A', // Primary green (logo/buttons)
          'green-light': 'rgba(52, 181, 58, 0.1)', // Light green backgrounds
          'green-hover': '#40CF45', // Hover state for buttons

          // Background colors
          'bg-dark': '#052208', // Dark background
          'bg-light': '#FFFFFF', // Light background
          'bg-gray': '#F5F5F5', // Gray background
          'bg-card-transparent': 'rgba(255, 255, 255, 0.1)', // Transparent card on dark bg

          // Text colors
          'text-white': '#FFFFFF', // White text
          'text-dark': '#1A1A1A', // Dark text
          'text-gray': '#666666', // Gray text

          // UI status colors
          'in-stock': '#34B53A', // Green for "in stock"
          'low-stock': '#FFA500', // Orange for "low stock"
          'no-stock': '#FF4747', // Red for "no stock"

          // UI elements
          'tag-bg': 'rgba(52, 181, 58, 0.1)', // Background for tags
          'tag-text': '#34B53A', // Text color for tags
          'dot-map': '#CCCCCC', // Gray dots on map
          'dot-map-active': '#34B53A', // Green dots on map
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'hero-dots': 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
        'hero-sphere': 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
        'dot-map': 'radial-gradient(#CCCCCC 1px, transparent 1px)',
        'dot-map-lg': 'radial-gradient(#CCCCCC 2px, transparent 2px)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-lg': '0 4px 12px rgba(0, 0, 0, 0.05)',
        feature: '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
