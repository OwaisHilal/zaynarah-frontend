/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Specify files where Tailwind should look for classes (important for purging)
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Add paths for shadcn/ui components if they are outside src
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  // 2. Enable Dark Mode based on the 'class' selector (standard for modern apps)
  darkMode: 'class',

  // 3. Define your custom theme extensions
  theme: {
    extend: {
      // ---------------- Custom Colors ----------------
      colors: {
        // Defines the primary brand color
        primary: {
          DEFAULT: '#C19A6B', // Luxury gold/bronze
          foreground: '#FFFFFF', // Text color to use on top of primary
        },
        // Used for backgrounds or secondary elements
        accent: {
          DEFAULT: '#EDE8DF', // Soft beige/cream
        },
        // Used for dark mode backgrounds or elegant text
        dark: {
          DEFAULT: '#1A1A1A', // Elegant deep black
        },
        // Shadcn components often require background/foreground definitions
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        // ... (Add other shadcn colors like border, input, ring if needed)
      },

      // ---------------- Custom Fonts ----------------
      fontFamily: {
        // Used for headings, large titles (Playfair Display, a luxury choice)
        display: ['Playfair Display', 'serif'],
        // Used for body text, paragraphs, buttons (Inter, modern and readable)
        body: ['Inter', 'sans-serif'],
        // If you are using shadcn defaults
        sans: ['Inter', 'sans-serif'],
      },

      // ---------------- Custom Utilities ----------------
      borderRadius: {
        // Provides softer, more elegant corners
        xl: '1rem',
        '2xl': '1.25rem',
      },

      boxShadow: {
        // Subtle shadow, avoids harsh contrast
        soft: '0 4px 20px rgba(0,0,0,0.06)',
      },
    },
  },

  // 4. Plugins (Usually required for shadcn/ui or custom utilities)
  plugins: [
    // require('tailwindcss-animate'), // If you are using shadcn/ui animation
    // require('@tailwindcss/typography'),
  ],
};
