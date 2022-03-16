import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import { config } from 'dotenv'

try {
    config({
        path: join(__dirname, '.env'),
    })
} catch (error) {
    console.log(`error: ${error}`)
}

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    resolve: {
        alias: [
            {
                find: '@',
                replacement: join(__dirname, 'src'),
            },
        ],
    },
    plugins: [vue()],
})
