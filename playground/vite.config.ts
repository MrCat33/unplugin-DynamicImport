import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgImport from "unplugin-svg-import/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgImport({
      iconDir: "src/assets/"
    })
  ],
})
