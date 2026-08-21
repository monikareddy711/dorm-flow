import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@dormflow/shared-types': path.resolve(__dirname, '../../packages/shared-types/src/index.ts'),
      '@dormflow/design-tokens': path.resolve(__dirname, '../../packages/design-tokens/src/index.ts'),
      '@dormflow/ui-react': path.resolve(__dirname, '../../packages/ui-react/src/index.ts'),
      '@dormflow/web-components': path.resolve(__dirname, '../../packages/dormflow-web-components/src/index.ts'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
