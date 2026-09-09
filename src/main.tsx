// Ensure window.fetch is safely assignable in sandboxed or strict environments
if (typeof window !== 'undefined' && window.fetch) {
  try {
    let currentFetch = window.fetch.bind(window);
    Object.defineProperty(window, 'fetch', {
      get() {
        return currentFetch;
      },
      set(newFetch) {
        if (typeof newFetch === 'function') {
          currentFetch = newFetch;
        }
      },
      configurable: true,
      enumerable: true,
    });
  } catch {
    // Ignore if not reconfigurable
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
