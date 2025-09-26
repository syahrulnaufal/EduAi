import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from "path";


export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        user: resolve(__dirname, 'user.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  }
})


