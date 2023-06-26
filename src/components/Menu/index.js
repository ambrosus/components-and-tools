import React, { useMemo, useState } from 'react';
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
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { UnsupportedChainIdError } from '@web3-react/core';

const Menu = ({
  web3ReactInstance,
  initHidden,
  customLogo,
  configuredInjectedConnector = defaultInjectedConnector,
  configuredWalletConnectConnector = defaultWalletConnectConnector,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const { account, connector, error, library } = web3ReactInstance;
  const { loginMetamask, loginWalletConnect, logout } = useAuthorization(
    web3ReactInstance,
    configuredInjectedConnector,
    configuredWalletConnectConnector
  );

  const connectorType = useMemo(() => {
    if (
      connector === configuredInjectedConnector ||
      connector instanceof InjectedConnector
    )
      return 'injected';
    if (
      connector === configuredWalletConnectConnector ||
      connector instanceof WalletConnectConnector
    )
      return 'wallet-connect';
    return undefined;
  }, [connector]);

  const isWrongNetwork = useMemo(() => {
    return error instanceof UnsupportedChainIdError;
  }, [error]);

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
          connector,
          isWrongNetwork,
        }}
      />
    </PrismicProvider>
  );
};

export default Menu;
