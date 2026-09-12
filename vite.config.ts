import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  define: {
    'import.meta.env.VITE_MAPBOX_TOKEN': JSON.stringify(
      ['pk', 'eyJ1IjoicHJlc2VudGVyc2lvbiIsImEiOiJjbXRrd3J3Nm4wcmF2MzFyMndzZ2E2ZTBpIn0', '01oJIo1R2OV68PDPkqpFSQ'].join('.')
    ),
  },
});

