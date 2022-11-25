import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { getCurrentAmbNetwork } from "./networksConfig";

const ambNetwork = getCurrentAmbNetwork();

export const defaultInjectedConnector = new InjectedConnector({
  supportedChainIds: [+ambNetwork.chainId],
});

export const defaultWalletConnectConnector = new WalletConnectConnector({
  rpc: {
    [+ambNetwork.chainId]: ambNetwork.rpcUrl,
  },
  chainId: ambNetwork.chainId,
  bridge: 'https://bridge.walletconnect.org',
  pollingInterval: 6000,
  qrcode: true,
  qrcodeModalOptions: {
    mobileLinks: ['metamask', 'trustee'],
  },
});
