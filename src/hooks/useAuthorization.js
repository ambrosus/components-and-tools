import {
  defaultInjectedConnector,
  defaultWalletConnectConnector,
} from '../utils';
import { Buffer } from 'buffer';

const useAuthorization = (
    web3ReactInstance,
    configuredInjectedConnector = defaultInjectedConnector,
    configuredWalletConnectConnector = defaultWalletConnectConnector
) => {
  const { activate, deactivate } = web3ReactInstance;

  const loginMetamask = () => {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      activate(configuredInjectedConnector).then(() => {
        localStorage.setItem('wallet', 'metamask');
      });
    } else {
      window
          .open(
              `https://metamask.app.link/dapp/${
                  window.location.hostname + window.location.pathname
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

// https://github.com/Uniswap/web3-react/issues/423#issuecomment-1161180629
window.Buffer = window.Buffer || Buffer;
