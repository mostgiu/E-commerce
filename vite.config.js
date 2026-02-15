import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  const isVercel = process.env.VERCEL === '1';

  return {
    base: isDevelopment || isVercel ? '/' : '/E-commerce/',
    plugins: [react(), tailwindcss(), flowbiteReact()],
  };
})