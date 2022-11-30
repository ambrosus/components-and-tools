import React from 'react';
import './index.scss';
import ConnectWalletButtonLayout from './components/ConnectWalletButtonLayout';
import MetamaskIcon from './assets/metamask-icon.svg';
import WalletConnectIcon from './assets/wallet-connect-icon.svg';

const MetamaskConnectButton = ({ onClick }) => (
  <ConnectWalletButtonLayout
    onClick={onClick}
    name='MetaMask'
    description='Connect using your browser wallet'
    logo={MetamaskIcon}
  />
);

const WalletConnectButton = ({ onClick }) => (
  <ConnectWalletButtonLayout
    onClick={onClick}
    name={'WalletConnect'}
    description={'Connect using WalletConnect'}
    logo={WalletConnectIcon}
  />
);

export { MetamaskConnectButton, WalletConnectButton };
