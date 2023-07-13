import {
  metamaskConnector as defaultMetamaskConnector,
  walletconnectConnector as defaultWalletconnectConnector,
} from '../utils';
// import switchToAmb from '../utils/switchToAmb';
import { useWeb3React } from '@web3-react/core';

const { REACT_APP_CHAIN_ID: chainId } = process.env;

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

    metamaskConnector
      .activate(+chainId)
      .then(() => {
        localStorage.setItem('wallet', 'metamask');
      })
      .catch((e) => console.log('metamask connection error', e));

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
    //TODO: fix this
    const hideVideoStaking = localStorage.getItem('hideVideoStaking');
    const hideVideoBridge = localStorage.getItem('hideVideoBridge');
    localStorage.clear();
    localStorage.setItem('hideVideoStaking', hideVideoStaking);
    localStorage.setItem('hideVideoBridge', hideVideoBridge);

    walletconnectConnector.activate(+chainId).catch((err) => {
      console.log('walletconnect-v2 connection error', err);
    });
  };

  const logout = () => {
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
