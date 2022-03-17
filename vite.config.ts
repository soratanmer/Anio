import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
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
    publicDir: './public',
    resolve: {
        alias: [
            {
                find: '@',
                replacement: join(__dirname, 'src'),
            },
        ],
    },
    server: {
        port: Number(process.env.DEV_SERVER_PORT),
        proxy: {
            '/api': {
                target: 'https://netease-cloud-music-api-soratanmer.vercel.app/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/'),
            },
        },
    },
    plugins: [
        vue(),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [join(__dirname, 'src/assets/icons')],
            // 指定symbolId格式
            symbolId: 'icon-[name]',
        }),
    ],
})
