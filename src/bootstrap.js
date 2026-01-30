// src/bootstrap.js
if ('serviceWorker' in navigator) {
  // Don’t await; keep it fire-and-forget so it doesn't block app startup
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/docs/sw.js')
      .then(reg => {
        console.log('[PWA] Service worker registered:', reg.scope);
      })
      .catch(err => {
        console.error('[PWA] Service worker registration failed:', err);
      });
  });
}