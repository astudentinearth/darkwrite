import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import electron from 'vite-plugin-electron/simple'
/// <reference types="vitest" />

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), electron({
    main:{
      entry: 'src/electron/main.ts'
    },
    preload: {
      input: path.join(__dirname, 'src/electron/preload.ts')
    },
    renderer: process.env.NODE_ENV === 'test' ? undefined : {}
  })
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: 'src/test/setup.ts'
  },
  clearScreen: false,
  server:{
    strictPort: true
  },
  envPrefix: ['VITE_', 'TAURI_PLATFORM', 'TAURI_ARCH', 'TAURI_FAMILY', 'TAURI_PLATFORM_VERSION', 'TAURI_PLATFORM_TYPE', 'TAURI_DEBUG'],
  build:{
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  resolve:{
    alias:{
      '@': path.resolve(__dirname, './src')
    }
  }
})
