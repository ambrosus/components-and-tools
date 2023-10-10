import React, { useMemo, useState } from 'react';
import './index.scss';
import { PrismicProvider } from '@prismicio/react';
import { client } from './prismic';
import MenuBody from './components/MenuBody';
import WalletModal from '../WalletModal';
import { useAuthorization } from '../../hooks';
import {
  metamaskConnector as defaultMetamaskConnector,
  walletconnectConnector as defaultWalletconnectConnector,
} from '../../utils';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { useWeb3React } from '@web3-react/core';

const Menu = ({
  initHidden,
  customLogo,
  metamaskConnector = defaultMetamaskConnector,
  walletconnectConnector = defaultWalletconnectConnector,
  supportedChains = [+process.env.REACT_APP_CHAIN_ID],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const { account, connector, chainId, isActive, provider } = useWeb3React();
  const { loginMetamask, loginWalletConnect, logout } = useAuthorization(
    metamaskConnector,
    walletconnectConnector
  );

  const connectorType = useMemo(() => {
    if (connector instanceof MetaMask) return 'metamask';
    if (connector instanceof WalletConnect) return 'walletconnect';
    return undefined;
  }, [connector]);

  const isWrongNetwork = useMemo(
    () => isActive && !supportedChains.includes(chainId),
    [chainId, isActive]
  );

  return (
    <PrismicProvider client={client}>
      <WalletModal
        isOpen={isModalOpen}
        {...{
          loginMetamask,
          loginWalletConnect,
          toggleModal,
        }}
      />
      <MenuBody
        {...{
          login: toggleModal,
          address: account,
          logout,
          initHidden,
          customLogo,
          connectorType,
          provider,
          isWrongNetwork,
        }}
      />
    </PrismicProvider>
  );
};

export default Menu;
