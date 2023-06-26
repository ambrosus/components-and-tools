import {
  defaultInjectedConnector,
  defaultWalletConnectConnector,
} from '../utils';
import {useMemo} from "react";

const useAuthorization = (
    web3ReactInstance,
    configuredInjectedConnector = defaultInjectedConnector,
    configuredWalletConnectConnector = defaultWalletConnectConnector
) => {
  const { activate, deactivate } = web3ReactInstance;

  const _window = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window;
    }
  }, []);

  const loginMetamask = () => {
    const { ethereum } = _window;
    if (ethereum && ethereum.isMetaMask) {
      activate(configuredInjectedConnector).then(() => {
        localStorage.setItem('wallet', 'metamask');
      });
    } else {
      _window
          .open(
              `https://metamask.app.link/dapp/${
                  _window.location.hostname + _window.location.pathname
              }`
          )
          .focus();
    }
  };

  const loginWalletConnect = () => {
    activate(configuredWalletConnectConnector).then(() => {
      localStorage.setItem('wallet', 'walletconnect');
    });
  };

  const logout = () => {
    localStorage.removeItem('wallet');
    deactivate();
  };

  return {
    loginMetamask,
    loginWalletConnect,
    logout,
  };
};

export default useAuthorization;
