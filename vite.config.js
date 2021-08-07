import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const { resolve } = require('path')

export default defineConfig({
    resolve:{
        alias: {
            '@': resolve(__dirname, 'src'),
            '~assets': resolve(__dirname, 'src/assets/'),
        },
    },
    server:{
        port:3001
    },
    plugins: [vue()]
})
