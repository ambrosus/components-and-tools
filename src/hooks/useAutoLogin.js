import { useEffect, useState } from 'react';
import { metamaskConnector as defaultMetamaskConnector } from '../utils';

const useAutoLogin = (metamaskConnector = defaultMetamaskConnector) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const lastAuthorizedWallet = localStorage.getItem('wallet');

      if (lastAuthorizedWallet === 'metamask') {
        metamaskConnector.connectEagerly().catch((e) => {
          console.log('metamask eager connection error', e);
        });
      }

      setIsLoaded(true);
    })();
  }, []);

  return isLoaded;
};

export default useAutoLogin;
