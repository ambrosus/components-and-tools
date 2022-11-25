import React from 'react';
import { createPortal } from 'react-dom';
import { useAuthorization } from '../../hooks';
import './index.scss';
import MetamaskIcon from './assets/metamask-icon.svg';
import WalletConnectIcon from './assets/wallet-connect-icon.svg';
import ChevronIcon from './assets/chevron.svg';

const WalletModal = ({ web3ReactInstance, isOpen = false }) => {
  const { loginMetamask, loginWalletConnect } = useAuthorization(web3ReactInstance);

  return isOpen ? createPortal(
    <div className='modal'>
      <div className='modal__overlay' />
      <div className='modal__container'>
        <p className='modal__text'>Please connect a wallet to use AirDAO</p>
        <button onClick={loginMetamask} className={"modal-button"}>
          <img
            alt='metamask logo'
            src={MetamaskIcon}
            className='modal-button__logo'
          />
          <div className='modal-button__text-container'>
            <h3 className='modal-button__heading'>MetaMask</h3>
            <p className='modal-button__text'>
              Connect using your browser wallet
            </p>
          </div>
          <img src={ChevronIcon} className='modal-button__chevron' alt='#' />
        </button>
        <button onClick={loginWalletConnect} className={"modal-button"}>
          <img
            alt='metamask logo'
            src={WalletConnectIcon}
            className='modal-button__logo'
          />
          <div className='modal-button__text-container'>
            <h3 className='modal-button__heading'>WalletConnect</h3>
            <p className='modal-button__text'>
              Connect using WalletConnect
            </p>
          </div>
          <img src={ChevronIcon} className='modal-button__chevron' alt='#' />
        </button>
      </div>
    </div>,
    document.querySelector('body')
  ) : null
}

export default WalletModal;
