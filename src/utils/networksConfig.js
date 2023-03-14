export const getCurrentAmbNetwork = (
  chainId = process.env.REACT_APP_CHAIN_ID || 16718
) => allAmbNetworksConfig[chainId];

export const allAmbNetworksConfig = {
  30746: {
    name: 'AirDAO Devnet',
    chainId: 30746,
    code: 'AMB',
    tokenSymbol: 'AMB',
    tokenDenomination: 18,
    explorerUrl: 'https://devnet.airdao.io/explorer/',
    rpcUrl: 'https://network.ambrosus-dev.io',
    rpcUrlWS: 'wss://network.ambrosus-dev.io/ws',
  },
  22040: {
    name: 'AirDAO Testnet',
    chainId: 22040,
    code: 'AMB',
    tokenSymbol: 'AMB',
    tokenDenomination: 18,
    explorerUrl: 'https://testnet.airdao.io/explorer/',
    rpcUrl: 'https://network.ambrosus-test.io',
    rpcUrlWS: 'wss://network.ambrosus-test.io/ws',
  },
  16718: {
    name: 'AirDAO Mainnet',
    chainId: 16718,
    code: 'AMB',
    tokenSymbol: 'AMB',
    tokenDenomination: 18,
    explorerUrl: 'https://airdao.io/explorer/',
    rpcUrl: 'https://network.ambrosus.io/',
    rpcUrlWS: 'wss://network.ambrosus.io/ws',
  },
};
