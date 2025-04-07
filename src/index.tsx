import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import { store } from './app/store';
import { ThemeProviderWrapper } from './theme/ThemeContext';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <ThemeProviderWrapper>
          <CssBaseline />
          <App />
        </ThemeProviderWrapper>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
);
