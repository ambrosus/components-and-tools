import {
  metamaskConnector as defaultMetamaskConnector,
  walletconnectConnector as defaultWalletconnectConnector,
} from '../utils';
// import switchToAmb from '../utils/switchToAmb';
import { useWeb3React } from '@web3-react/core';

const useAuthorization = (
  metamaskConnector = defaultMetamaskConnector,
  walletconnectConnector = defaultWalletconnectConnector
) => {
  const { connector } = useWeb3React();

  const loginMetamask = () => {
    // if (error instanceof UnsupportedChainIdError) {
    //   return library.getProvider().then((provider) => {
    //     switchToAmb(provider);
    //   });
    // }

    metamaskConnector.activate(22040).then(() => {});

    // const { ethereum } = window;
    // if (ethereum && ethereum.isMetaMask) {
    //   metamaskConnector.activate().then(() => {
    //     localStorage.setItem('wallet', 'metamask');
    //   });
    // } else {
    //   window
    //     .open(
    //       `https://metamask.app.link/dapp/${
    //         window.location.hostname + window.location.pathname
    //       }`
    //     )
    //     .focus();
    // }
  };

  const loginWalletConnect = () => {
    console.log(walletconnectConnector);
    walletconnectConnector
      .activate(22040)
      .then((res) => {
        console.log('res', res);
        localStorage.setItem('wallet', 'walletconnect');
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const logout = () => {
    localStorage.removeItem('wallet');
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }
  };

  return {
    loginMetamask,
    loginWalletConnect,
    logout,
  };
};

export default useAuthorization;
