import { changeChainId, getCurrentAmbNetwork } from './index';

export default function switchToAmb(provider) {
  const ambNetwork = getCurrentAmbNetwork();
  return changeChainId(provider, ambNetwork);
}
