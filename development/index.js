import * as ReactDOM from 'react-dom';
import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import Main from './Main';

import {
  metamaskConnector,
  metamaskHooks,
  walletconnectConnector,
  walletconnectHooks,
} from '../dist/utils';

const connectors = [
  [metamaskConnector, metamaskHooks],
  [walletconnectConnector, walletconnectHooks],
];

const App = () => (
  <Web3ReactProvider connectors={connectors}>
    <Main />
  </Web3ReactProvider>
);

ReactDOM.render(<App />, document.getElementById('app'));
