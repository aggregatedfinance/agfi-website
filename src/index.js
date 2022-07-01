import React from 'react';
import ReactDOM from 'react-dom';
import { DAppProvider } from '@usedapp/core';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { SubgraphProvider } from './SubgraphProvider';

ReactDOM.render(
  <SubgraphProvider>
    <DAppProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </DAppProvider>
  </SubgraphProvider>,
  document.getElementById('root')
);
