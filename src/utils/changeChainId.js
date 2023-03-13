import { utils } from 'ethers';

const changeChainId = async (provider, selectedNetwork) => {
  const hexChainId = utils.hexValue(+selectedNetwork.chainId);

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
  } catch (error) {
    // EIP-1193 userRejectedRequest error
    if (error.code === 4001) return;
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: hexChainId,
          chainName: selectedNetwork.name,
          nativeCurrency: {
            name: selectedNetwork.tokenSymbol,
            symbol: selectedNetwork.tokenSymbol,
            decimals: selectedNetwork.tokenDenomination,
          },
          rpcUrls: [selectedNetwork.rpcUrl],
          blockExplorerUrls: [selectedNetwork.explorerUrl],
        },
      ],
    });
  }
};

export default changeChainId;
