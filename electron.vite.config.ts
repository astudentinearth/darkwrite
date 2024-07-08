import react from "@vitejs/plugin-react"
import {defineConfig, externalizeDepsPlugin} from "electron-vite"
import path from "path";

export default defineConfig({
    main:{
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        plugins: [react()],
        resolve:{
            alias:{
                "@renderer":path.resolve("src/renderer/src")
            }
        }
    }
});