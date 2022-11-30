import React, { useState } from 'react';
import './index.scss';
import { PrismicProvider } from '@prismicio/react';
import { client } from './prismic';
import MenuBody from './components/MenuBody';
import WalletModal from '../WalletModal';
import { useAuthorization } from '../../hooks';

const Menu = ({ web3ReactInstance, initHidden, customLogo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const { account } = web3ReactInstance;
  const { loginMetamask, loginWalletConnect, logout } =
    useAuthorization(web3ReactInstance);

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
        }}
      />
    </PrismicProvider>
  );
};

export default Menu;
