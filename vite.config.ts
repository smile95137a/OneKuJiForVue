import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: '再來一抽線上一番賞-一番賞-萬代公仔-GK公仔-3C抽獎',
        },
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://18.176.59.29/', // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
