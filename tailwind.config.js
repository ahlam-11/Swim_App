/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['var(--font-dm-sans)',     'system-ui', 'sans-serif'],
        serif: ['var(--font-dm-serif)',    'Georgia',   'serif'],
        mono:  ['var(--font-space-mono)',  'monospace'],
      },
    },
  },
  plugins: [],
}
