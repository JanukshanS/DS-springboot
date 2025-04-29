import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    // Resolve aliases for cleaner imports
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@services': resolve(__dirname, 'src/services'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@config': resolve(__dirname, 'src/config'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@hooks': resolve(__dirname, 'src/hooks'),
      },
    },

    // Server configuration
    server: {
      port: 3000,
      strictPort: true,
      host: true, // Listen on all addresses
      proxy: {
        // Proxy API requests to backend services
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      // Minify options
      minify: mode === 'production' ? 'esbuild' : false,
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __APP_ENV__: JSON.stringify(mode),
    },
  };
});
