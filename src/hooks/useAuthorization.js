import {
  addAmbNetwork,
  metamaskConnector as defaultMetamaskConnector,
  walletconnectConnector as defaultWalletconnectConnector,
  bitgetWalletConnector as defaultBitgetWalletConnector,
} from '../utils';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';

const defaultChainId =
  process.env.REACT_APP_CHAIN_ID || process.env.NEXT_PUBLIC_CHAIN_ID;

const useAuthorization = (
  metamaskConnector = defaultMetamaskConnector,
  walletconnectConnector = defaultWalletconnectConnector,
  bitgetWalletConnector = defaultBitgetWalletConnector,
  chainId = defaultChainId
) => {
  const { connector } = useWeb3React();

  const _window = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window;
    }
  }, []);

  const loginMetamask = () => {
    const { ethereum } = _window;
    if (ethereum && ethereum.isMetaMask) {
      return metamaskConnector
        .activate(+chainId)
        .then(() => {
          localStorage.setItem('wallet', 'metamask');
        })
        .catch((e) => {
          if (e.code === 4902) {
            addAmbNetwork(ethereum);
          }
          console.log('metamask connection error', e);
        });
    } else {
      return _window
        .open(
          `https://metamask.app.link/dapp/${
            _window.location.hostname + _window.location.pathname
          }`
        )
        .focus();
    }
  };

  const loginBitget = () => {
    const { bitgetTonWallet } = _window;
    if (bitgetTonWallet) {
      return bitgetWalletConnector
        .activate(+chainId)
        .then(() => localStorage.setItem('wallet', 'bitget'))
        .catch((e) => {
          if (e.code === 4902) {
            addAmbNetwork(bitgetTonWallet);
          }
          console.log('metamask connection error', e);
        });
    } else {
      return _window
        .open(
          `https://web3.bitget.com/en/wallet-download?type=1`
        )
        .focus();
    }
  }

  const loginSafepal = () => {
    const { safepalProvider } = _window;
    if (safepalProvider) {
      return metamaskConnector
        .activate(+chainId)
        .then(() => {
          localStorage.setItem('wallet', 'metamask');
        })
        .catch((e) => {
          if (e.code === 4902) {
            addAmbNetwork(safepalProvider);
          }
          console.log('metamask connection error', e);
        });
    } else {
      return _window
        .open('https://www.safepal.com/download?product=2')
        .focus();
    }
  };

  const loginWalletConnect = async () => {
    // clear indexedDB related to walletconnect
    await _window.indexedDB.deleteDatabase('WALLET_CONNECT_V2_INDEXED_DB');
    console.info('initiating walletconnect-v2 connection');

    return walletconnectConnector.activate(+chainId).catch((err) => {
      console.log('walletconnect-v2 connection error', err);
    });
  };

  const logout = () => {
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }
    localStorage.removeItem('wallet');
  };

  return {
    loginMetamask,
    loginWalletConnect,
    loginSafepal,
    loginBitget,
    logout,
  };
};

export default useAuthorization;
