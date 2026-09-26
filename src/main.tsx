import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for installability and offline support (protecting dev iframe)
// Preserve beforeinstallprompt globally on window so modals or banners can immediately consume it
(window as unknown as { __studymaster_deferred_prompt?: Event }).__studymaster_deferred_prompt = undefined;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  (window as unknown as { __studymaster_deferred_prompt?: Event }).__studymaster_deferred_prompt = e;
  window.dispatchEvent(new CustomEvent('studymaster-prompt-captured'));
});

if ('serviceWorker' in navigator) {
  const isIframe = window.self !== window.top;
  // If running directly in browser (not in AI Studio editor preview iframe) or in PROD, register SW
  if (import.meta.env.PROD || !isIframe) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Immediately check for updates whenever app opens or regains focus
          registration.update().catch(() => {});
          window.addEventListener('focus', () => {
            registration.update().catch(() => {});
          });
        })
        .catch((err) => {
          console.log('SW registration note:', err);
        });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  } else {
    // Inside AI Studio editing iframe, unregister to avoid intercepting hot module reloads
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
