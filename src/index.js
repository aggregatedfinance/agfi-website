import React from 'react';
import ReactDOM from 'react-dom';
import { DAppProvider, Mainnet } from '@usedapp/core';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { SubgraphProvider } from './SubgraphProvider';

import './index.css';

const config = {
  autoConnect: true,
  fastMulticallEncoding: true,
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: 'https://mainnet.infura.io/v3/d92939f3efa543448c8d20c526819c18'
  }
};

ReactDOM.render(
  <SubgraphProvider>
    <DAppProvider config={config}>
      <HashRouter>
        <App />
      </HashRouter>
    </DAppProvider>
  </SubgraphProvider>,
  document.getElementById('root')
);
