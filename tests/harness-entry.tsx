/**
 * Entry point compiled by `npm run test:build` into a single IIFE the JSDOM
 * harness can eval. Not shipped to users.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initI18n } from '../src/i18n/config';
import App from '../src/App';

declare global {
  interface Window {
    __render: (path: string) => Promise<void>;
  }
}

window.__render = async (path: string) => {
  window.history.replaceState({}, '', path);
  const container = document.getElementById('root');
  if (!container) throw new Error('missing #root');
  container.innerHTML = '';
  await initI18n();
  // StrictMode on purpose: it double-invokes effects, which is what surfaces
  // the render loop that shipped in the old dashboard.
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};
