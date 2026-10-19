/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        'academic-navy': '#0b1b3d',
        'academic-blue': '#0284c7',
        'academic-hover': '#0369a1',
        'academic-subtle': '#f1f5f9',
        'academic-border': '#e2e8f0',
        mro: {
          navy: '#0A192F',
          blue: '#1E40AF',
          accent: '#2563EB',
          light: '#F8FAFC',
        },
      },
      boxShadow: {
        'academic-hover': '0 6px 24px -2px rgba(11, 27, 61, 0.08), 0 2px 6px -1px rgba(11, 27, 61, 0.04)',
      },
    },
  },
  plugins: [],
};