import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://lobsterfacts.thepickle.dev',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei'],
    },
  },
});
