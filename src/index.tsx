import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit'

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SolanaProvider from './helpers/solanaProvider';
import reducer from './reducers';

const store = configureStore({reducer});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SolanaProvider>
        <App />
      </SolanaProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
