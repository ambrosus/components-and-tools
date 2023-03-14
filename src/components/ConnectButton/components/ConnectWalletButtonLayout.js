import React from 'react';
import { ReactComponent as ChevronIcon } from '../assets/chevron.svg';

const ConnectWalletButtonLayout = ({ onClick, name, description, logo }) => (
  <button onClick={onClick} className={'modal-button'} id={name}>
    <img alt='metamask logo' className='modal-button__logo' src={logo} />
    <div className='modal-button__text-container'>
      <h3 className='modal-button__heading'>{name}</h3>
      <p className='modal-button__text'>{description}</p>
    </div>
    <ChevronIcon className='modal-button__chevron' alt='#' />
  </button>
);

export default ConnectWalletButtonLayout;
