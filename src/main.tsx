import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ExperimentProvider } from './store/experimentStore';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExperimentProvider>
      <App />
    </ExperimentProvider>
  </React.StrictMode>
);
