/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mro: {
          navy: "#0A192F",
          blue: "#1E40AF",
          accent: "#2563EB",
          light: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
};