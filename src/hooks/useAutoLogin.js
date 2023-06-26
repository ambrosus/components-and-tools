import { useEffect, useState } from 'react';
import { defaultInjectedConnector } from '../utils';

const useAutoLogin = (
  web3ReactInstance,
  configuredInjectedConnector = defaultInjectedConnector
) => {
  const { activate } = web3ReactInstance;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      let _window;

      if (typeof window !== 'undefined') {
        _window = window;
      }

      const { ethereum } = _window;
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

  return isLoaded;
};

export default useAutoLogin;
