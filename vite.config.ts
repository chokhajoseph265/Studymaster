import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'StudyMaster Malawi - Student & Admin Study Companion',
          short_name: 'StudyMaster',
          description: 'Offline-first secondary school study companion and administration console for MSCE & JCE in Malawi, featuring notes, past papers, quizzes, and admin portal.',
          theme_color: '#059669',
          background_color: '#064e3b',
          display: 'standalone',
          orientation: 'portrait-primary',
          prefer_related_applications: false,
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
          shortcuts: [
            {
              name: 'StudyMaster Student App',
              short_name: 'Student App',
              description: 'Open Student Study Companion with notes, quizzes & past papers',
              url: '/?app=student',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'StudyMaster Admin Portal',
              short_name: 'Admin Portal',
              description: 'Open Administration Console, student analytics & content editor',
              url: '/#admin',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'MSCE Past Papers',
              short_name: 'Past Papers',
              description: 'Practice MANEB national examination past papers',
              url: '/?tab=past-papers',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Scientific Calculator',
              short_name: 'Calculator',
              description: 'MANEB Math and Science Calculator',
              url: '/?calc=open',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdn-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('scheduler') ||
                id.includes('motion')
              ) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
            }
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: false,
      watch: null,
    },
  };
});
