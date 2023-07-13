import { useEffect } from 'react';
import { metamaskConnector as defaultMetamaskConnector } from '../utils';

const useAutoLogin = (metamaskConnector = defaultMetamaskConnector) => {
  // const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const lastAuthorizedWallet = localStorage.getItem('wallet');

      if (lastAuthorizedWallet === 'metamask') {
        metamaskConnector.connectEagerly().catch((e) => {
          console.log('metamask eager connection error', e);
        });
      }
    })();
  }, []);

  // return isLoaded;
  return true;
};

export default useAutoLogin;
