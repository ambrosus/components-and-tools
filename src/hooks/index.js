import useAuthorization from "./useAuthorization";
import useAutoLogin from "./useAutoLogin";

// https://github.com/WalletConnect/walletconnect-monorepo/issues/748#issuecomment-1178160422
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;

export { useAuthorization, useAutoLogin }
