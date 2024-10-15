import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html'
export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: '再來一抽',
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
