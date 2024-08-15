import { useEffect, useState } from 'react';
import {
  metamaskConnector as defaultMetamaskConnector,
  bitgetWalletConnector as defaultBitgetConnector
} from '../utils';

const useAutoLogin = (metamaskConnector = defaultMetamaskConnector, bitgetConnector = defaultBitgetConnector) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const lastAuthorizedWallet = localStorage.getItem('wallet');

      if (lastAuthorizedWallet === 'metamask') {
        await metamaskConnector.connectEagerly().then(res => console.log(res)).catch((e) => {
          console.log('metamask eager connection error', e);
        });
      } else if (lastAuthorizedWallet === 'bitget') {
        await bitgetConnector.connectEagerly().catch((e) => {
          console.log('bitget eager connection error', e);
        })
      }

      setIsLoaded(true);
    })();
  }, []);

  return isLoaded;
};

export default useAutoLogin;
