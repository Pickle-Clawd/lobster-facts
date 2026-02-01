/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'coral': {
          400: '#ff8a6a',
          500: '#ff6b4a',
          600: '#e65a3a',
        },
      },
    },
  },
  plugins: [],
}
