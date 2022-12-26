import { useEffect, useState } from 'react';
import { UnsupportedChainIdError } from '@web3-react/core';
import { defaultInjectedConnector } from '../utils';
import changeChainId from '../utils/changeChainId';
import { getCurrentAmbNetwork } from '../utils';

const useAutoLogin = (
  web3ReactInstance,
  configuredInjectedConnector = defaultInjectedConnector
) => {
  const { activate, error, connector } = web3ReactInstance;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { ethereum } = window;
      // eslint-disable-next-line no-underscore-dangle
      const isUnlocked = await (ethereum &&
        ethereum._metamask &&
        ethereum._metamask.isUnlocked());

      const lastAuthorizedWallet = localStorage.getItem('wallet');

      if (lastAuthorizedWallet === 'metamask' && isUnlocked) {
        activate(configuredInjectedConnector).then(() => setIsLoaded(true));
      } else {
        setIsLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (error instanceof UnsupportedChainIdError) {
        if (!document.hidden) {
          const provider = await connector.getProvider();
          const ambNetwork = getCurrentAmbNetwork();
          changeChainId(provider, ambNetwork);
        }
      }
    })();
  }, [error]);

  return isLoaded;
};

export default useAutoLogin;
