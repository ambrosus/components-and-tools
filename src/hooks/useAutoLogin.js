import { useEffect } from 'react';
import { metamaskConnector as defaultMetamaskConnector } from '../utils';

const useAutoLogin = (metamaskConnector = defaultMetamaskConnector) => {
  // const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // (async () => {
    //   const lastAuthorizedWallet = localStorage.getItem('wallet');
    //
    //   if (lastAuthorizedWallet === 'metamask' && isUnlocked) {
    //     activate(configuredInjectedConnector).then(() => setIsLoaded(true));
    //   } else {
    //     setIsLoaded(true);
    //   }
    // })();
    metamaskConnector.connectEagerly().catch((e) => {
      console.log(e);
    });
  }, []);

  // return isLoaded;
  return true;
};

export default useAutoLogin;
