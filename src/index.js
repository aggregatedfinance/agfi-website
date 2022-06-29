import React from 'react';
import ReactDOM from 'react-dom';
import { DAppProvider } from '@usedapp/core';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SubgraphProvider } from './SubgraphProvider';

ReactDOM.render(
  <SubgraphProvider>
    <DAppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DAppProvider>
  </SubgraphProvider>,
  document.getElementById('root')
);
