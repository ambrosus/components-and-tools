import {
  metamaskConnector,
  metamaskHooks,
  walletconnectConnector,
  walletconnectHooks,
  bitgetWalletConnector,
  bitgetHooks,
} from './web3ReactConnectors';
import changeChainId from './changeChainId';
import { allAmbNetworksConfig, getCurrentAmbNetwork } from './networksConfig';
import getBranchLastUpdatedString from './getBranchLastUpdatedString';
import switchToAmb from './switchToAmb';
import addAmbNetwork from './addAmbNetwork';

export {
  metamaskConnector,
  metamaskHooks,
  walletconnectConnector,
  walletconnectHooks,
  bitgetWalletConnector,
  bitgetHooks,
  changeChainId,
  allAmbNetworksConfig,
  getCurrentAmbNetwork,
  getBranchLastUpdatedString,
  switchToAmb,
  addAmbNetwork,
};
