import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SolanaProvider from './helpers/solanaProvider';
import './index.css';


const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
      <SolanaProvider>
        <App />
      </SolanaProvider>
  </React.StrictMode>
);
