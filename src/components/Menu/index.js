import React, { useState } from 'react';
import './index.scss';
import { PrismicProvider } from '@prismicio/react';
import { client } from './prismic';
import MenuBody from './components/MenuBody';
import WalletModal from '../WalletModal';
import { useAuthorization } from '../../hooks';
import {
  defaultInjectedConnector,
  defaultWalletConnectConnector,
} from '../../utils';

const Menu = ({
  web3ReactInstance,
  initHidden,
  customLogo,
  configuredInjectedConnector = defaultInjectedConnector,
  configuredWalletConnectConnector = defaultWalletConnectConnector,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const { account, connector } = web3ReactInstance;
  const { loginMetamask, loginWalletConnect, logout } = useAuthorization(
    web3ReactInstance,
    configuredInjectedConnector,
    configuredWalletConnectConnector
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
          connector,
        }}
      />
    </PrismicProvider>
  );
};

export default Menu;
