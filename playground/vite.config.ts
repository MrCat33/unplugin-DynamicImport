import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import consolePlugin from '../dist/vite.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    consolePlugin({
      include: [/\.ts/],
      exclude: [/\.test$/],
    })
  ],
})
