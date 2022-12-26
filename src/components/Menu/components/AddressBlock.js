import React, { useMemo, useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { Metamask } from '../assets/Metamask';
import { WalletConnectLogo } from '../assets/WalletConnectLogo';
import { Logout } from '../assets/Logout';
import { Check } from '../assets/Check';
import { Copy } from '../assets/Copy';

const AddressBlock = ({ address = '', logout, connectorType }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);

    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(address);
    }
    return null;
  };

  return (
    <div className='address-block'>
      <div className='address-block__wallet-icon'>
        {connectorType === 'injected' ? <Metamask /> : null}
        {connectorType === 'wallet-connect' ? <WalletConnectLogo /> : null}
      </div>
      <span>{`${address.slice(0, 4)}...${address.slice(
        address.length - 4,
        address.length
      )}`}</span>
      <button onClick={logout} type='button' style={{ marginLeft: 'auto' }}>
        <Logout />
      </button>
      <button
        onClick={copyToClipboard}
        type='button'
        className='address-block__copy'
      >
        {isCopied ? <Check /> : <Copy />}
      </button>
    </div>
  );
};

export default AddressBlock;
