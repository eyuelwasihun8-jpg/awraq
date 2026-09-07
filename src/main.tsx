import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { initI18n } from './i18n/config';
import App from './App';

/**
 * Entry point.
 *
 * The old main.tsx did `document.getElementById('root')!` — a non-null
 * assertion that turns a missing mount node into a cryptic
 * "Cannot read properties of null" at runtime. It also rendered outside
 * StrictMode, which is why the dashboard's infinite render loop
 * (AUDIT.md §C1) survived development unnoticed.
 */
const container = document.getElementById('root');

if (!container) {
  throw new Error('Mount node #root is missing from index.html.');
}

// i18next resolves before the first paint so the UI never renders in one
// language and then swaps to the other — a jarring flash on every load for
// Amharic-speaking visitors.
void initI18n().then(() => {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
