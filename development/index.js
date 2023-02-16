import * as ReactDOM from 'react-dom';
import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import Main from './Main';

const getLibrary = (provider = null) => new providers.Web3Provider(provider);

const App = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Main />
  </Web3ReactProvider>
);

ReactDOM.render(<App />, document.getElementById('app'));
