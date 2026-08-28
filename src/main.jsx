import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const mountRoot = () => {
  const container = document.getElementById('root');
  if (container) {
    if (!container._reactRoot) {
      const root = ReactDOM.createRoot(container);
      container._reactRoot = root;
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountRoot);
} else {
  mountRoot();
}
