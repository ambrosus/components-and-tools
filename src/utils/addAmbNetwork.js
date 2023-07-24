import { getCurrentAmbNetwork } from './networksConfig';
import { utils } from 'ethers';

export default function addAmbNetwork(provider) {
  const ambNetwork = getCurrentAmbNetwork();
  const hexChainId = utils.hexValue(+ambNetwork.chainId);

  return provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: hexChainId,
        chainName: ambNetwork.name,
        nativeCurrency: {
          name: ambNetwork.tokenSymbol,
          symbol: ambNetwork.tokenSymbol,
          decimals: ambNetwork.tokenDenomination,
        },
        rpcUrls: [ambNetwork.rpcUrl],
        blockExplorerUrls: [ambNetwork.explorerUrl],
      },
    ],
  });
}
