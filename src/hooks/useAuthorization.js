import {
  addAmbNetwork,
  metamaskConnector as defaultMetamaskConnector,
  walletconnectConnector as defaultWalletconnectConnector,
} from '../utils';
import { useWeb3React } from '@web3-react/core';
import {useMemo} from "react";

const chainId = process.env.REACT_APP_CHAIN_ID || process.env.NEXT_PUBLIC_CHAIN_ID;

const useAuthorization = (
  metamaskConnector = defaultMetamaskConnector,
  walletconnectConnector = defaultWalletconnectConnector
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

  const loginWalletConnect = () => {
    // clear all localstorage entries related to walletconnect
    const currLocalStorage = { ...localStorage };
    localStorage.clear();
    for (const key in currLocalStorage) {
      if (!key.includes('wc@2')) {
        localStorage.setItem(key, currLocalStorage[key]);
      }
    }

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
    logout,
  };
};

export default useAuthorization;
