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
      colors: {
        brand: {
          gold: 'rgb(var(--brand-gold))',
          rose: 'rgb(var(--brand-rose))',
          black: 'rgb(var(--brand-black))',
        },
        bg: {
          primary: 'rgb(var(--bg-primary))',
          secondary: 'rgb(var(--bg-secondary))',
        },
        text: {
          primary: 'rgb(var(--text-primary))',
          secondary: 'rgb(var(--text-secondary))',
        },
        border: {
          subtle: 'rgb(var(--border-subtle))',
        },
      },
    },
  },
  darkMode: 'class',

  // 4. Plugins (Usually required for shadcn/ui or custom utilities)
  plugins: [
    // require('tailwindcss-animate'), // If you are using shadcn/ui animation
    // require('@tailwindcss/typography'),
  ],
};
