import React from 'react';
import ChevronIcon from '../assets/chevron.svg';

const ConnectWalletButtonLayout = ({ onClick, name, description, logo }) => (
  <button onClick={onClick} className={'modal-button'} id={name}>
    {React.createElement(logo, {
      alt: 'metamask logo',
      className: 'modal-button__logo',
    })}
    <div className='modal-button__text-container'>
      <h3 className='modal-button__heading'>{name}</h3>
      <p className='modal-button__text'>{description}</p>
    </div>
    <ChevronIcon className='modal-button__chevron' alt='#' />
  </button>
);

export default ConnectWalletButtonLayout;
