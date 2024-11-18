import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Comonents from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import viteCompression from 'vite-plugin-compression';

const env = loadEnv('', process.cwd());

const plugins = [
  vue(),
  vueJsx(),
  UnoCSS('./uno.config.ts'),
  AutoImport({
    imports: ['vue'],
    dts: './src/auto-imports.d.ts',
    vueTemplate: true,
  }),
  Comonents({
    resolvers: [NaiveUiResolver()],
  }),
  viteCompression(),
];

if (process.env.NODE_ENV === 'local') {
  plugins.push(analyzer());
}

// https://vitejs.dev/config/
export default defineConfig({
  base: env.VITE_APP_BASE_URL || '/',
  plugins,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: env.VITE_API_HOST || 'http://127.0.0.1:3000',
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 'vendor-g2': ['@antv/g2'],
          // 'vendor-chart': [
          //   '@/components/ChartDesigner/ChartDesigner.vue',
          //   '@/components/Charts/ChartRender.vue',
          // ],
        },
      },
    },
  },
});
