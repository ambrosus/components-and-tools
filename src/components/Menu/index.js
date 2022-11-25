import React, { useState } from 'react';
import './index.scss';
import { PrismicProvider } from '@prismicio/react';
import { client } from './prismic';
import MenuBody from './MenuBody';
import WalletModal from '../WalletModal';

const Menu = ({ web3ReactInstance, initHidden, customLogo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(prev => !prev);
  const { address, logout } = web3ReactInstance;

  return (
    <PrismicProvider client={client}>
      <WalletModal
        isOpen={isModalOpen}
        web3ReactInstance={web3ReactInstance}
      />
      <MenuBody
        {...{
          login: toggleModal,
          address,
          logout,
          initHidden,
          customLogo
        }}
      />
    </PrismicProvider>
  );
}

export default Menu
