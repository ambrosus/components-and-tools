# Airdao components and tools
Library with common components, hooks and utils for airdao projects.

## Requirements:
For this lib strongly required
```react-scripts >= 5``` or ```webpack >= 5```
and this peer dependencies:

``` .json
"@web3-react/core": "^6.1.9",
"ethers": "^5.3.0",
"react": ">=17.0.2",
"react-dom": ">=17.0.2"
```

## Installation:
``` 
npm install https://github.com/ambrosus/airdao-components-and-tools
```
or
```
yarn add https://github.com/ambrosus/airdao-components-and-tools
```
You can use https://github.com/ambrosus/airdao-components-and-tools#dev branch to see the latest updates

## Instructions:
This library implements "connecting to wallet" logic that is common for all our front-end apps.
Therefore it's dependent on [@web3-react](https://github.com/Uniswap/web3-react), and you should 
configure it first (simply wrap all the app with [Web3ReactProvider](https://github.com/Uniswap/web3-react/tree/v6/docs#web3reactprovider))

Lib provides configured ```@web3-react/injected-connector``` and ```@web3-react/walletconnect-connector``` 
for Ambrosus network but allows you to pass your own custom configured connectors.

### Usage TLDR:
1. Wrap all the app with ```Web3ReactProvider```
2. Use ```useAutoLogin``` hook, and render the app only if "isLoaded" returned from this hook is true. \
This needed to be sure that useAutoLogin got previous login from local storage and tried to autologin user
3. Add ```Menu``` component in your layout and pass it Web3ReactInstance
4. Use ```useAuthorization``` to get login and logout functions.

## Usage:
### Menu
```jsx
import { Menu } from 'airdao-components-and-tools/components';
import { useWeb3React } from '@web3-react/core';

const App = () => {
  const web3ReactInstance = useWeb3React();
  
  return(
    <>
      <Menu 
        web3ReactInstance={web3ReactInstance}
        initHidden={false}
        customLogo={<Logo />}
        configuredInjectedConnector={connector}
        configuredWalletConnectConnector={connector}
      />
      ...
    </>
  )
}
```
| Property name |  Default |  Description |
|:-----|:-----------| :------ |
| web3ReactInstance **[required]**  |  | Context from [useWeb3React()](https://github.com/Uniswap/web3-react/tree/v6/docs#useweb3react) hook |
| initHidden   |  ```false```   | Menu would appear closed as default
| customLogo   | ```undefined``` | Custom components to be shown as logo at top left
| configuredInjectedConnector   | ```defaultInjectedConnector``` from [web3ReactConnectors.js](src/utils/web3ReactConnectors.js)  | [@web3-react/injected-connector](https://github.com/Uniswap/web3-react/blob/v6/docs/connectors/injected.md) configured for Ambrosus network
| configuredWalletConnectConnector   | ```defaultWalletConnectConnector``` from [web3ReactConnectors.js](src/utils/web3ReactConnectors.js)  | [@web3-react/walletconnect-connector](https://github.com/Uniswap/web3-react/blob/v6/docs/connectors/walletconnect.md) configured for Ambrosus network

### useAutoLogin
```jsx
import { useAutoLogin } from 'airdao-components-and-tools/hooks';
import { useWeb3React } from '@web3-react/core';

const App = () => {
  const web3ReactInstance = useWeb3React();
  const isLoaded = useAutoLogin(web3ReactInstance, ConfiguredInjectedConnector);
  
  return isLoaded ? <>...</> : null
}
```
| Property name |  Default |  Description |
|:-----|:-----------| :------ |
| web3ReactInstance **[required]**  |  | Context from [useWeb3React()](https://github.com/Uniswap/web3-react/tree/v6/docs#useweb3react) hook |
| configuredInjectedConnector   | ```defaultInjectedConnector``` from [web3ReactConnectors.js](utils/web3ReactConnectors.js)  | [@web3-react/injected-connector](https://github.com/Uniswap/web3-react/blob/v6/docs/connectors/injected.md) configured for Ambrosus network

### useAuthorization
```jsx
import { useAuthorization } from 'airdao-components-and-tools/hooks';
import { useWeb3React } from '@web3-react/core';

const SomeConnectPage = () => {

  const web3ReactInstance = useWeb3React();
  const { loginMetamask, loginWalletConnect, logout } = useAuthorization(
    web3ReactInstance,
    ConfiguredInjectedConnector,
    ConfiguredWalletConnectConnector
  );
  
  return (
    <div>
      <button onClick={loginMetamask}>
        Connect Metamask
      </button>
      <button onClick={loginWalletConnect}>
        Connect WalletConnect
      </button>
      <button onClick={logout}>
        Logout
      </button>
    <div/>
  )
  
}
```
| Property name |  Default |  Description |
|:-----|:-----------| :------ |
| web3ReactInstance **[required]**  |  | Context from [useWeb3React()](https://github.com/Uniswap/web3-react/tree/v6/docs#useweb3react) hook |
| configuredInjectedConnector   | ```defaultInjectedConnector``` from [web3ReactConnectors.js](utils/web3ReactConnectors.js)  | [@web3-react/injected-connector](https://github.com/Uniswap/web3-react/blob/v6/docs/connectors/injected.md) configured for Ambrosus network
| configuredWalletConnectConnector   | ```defaultWalletConnectConnector``` from [web3ReactConnectors.js](utils/web3ReactConnectors.js)  | [@web3-react/walletconnect-connector](https://github.com/Uniswap/web3-react/blob/v6/docs/connectors/walletconnect.md) configured for Ambrosus network


### HelpMenu
```jsx
import { HelpMenu } from 'airdao-components-and-tools/components';

const helpContent = {
  title: 'AirDAO Bridge',
  description:
    'The AirDAO Bridge enables you to transfer crypto tokens between the AirDAO blockchain, Ethereum blockchain (ETH), and BNB Smart Chain (BSC).',
  video: {
    url: 'https://www.youtube.com/watch?v=PEa6J18GvSo&t=167s&ab_channel=AirDAO%E2%80%94builtonAMB-NET',
    thumbnailSrc: thumbnail,
  },
  guideLink: {
    text: 'Go to AirDAO Academy →',
    url: 'https://airdao.academy/guides/bridge',
  },
  links: [
    {
      text: 'Help Center',
      url: 'https://airdao.academy/',
    },
    {
      text: 'Whats New',
      url: 'https://airdao.academy/change-log',
    },
    {
      text: 'Place Feedback & Report Bugs',
      url: 'https://forms.gle/vRqhvT5pLAFic7Z77',
    },
    {
      text: 'Github',
      url: 'https://github.com/ambrosus/',
    },
  ],
  socials: [
    {
      url: 'https://twitter.com/airdao_io',
      iconSrc: twitterIcon,
    },
    {
      url: 'https://t.me/airDAO_official',
      iconSrc: telegramIcon,
    },
    {
      url: 'https://www.reddit.com/r/AirDAO/',
      iconSrc: redditIcon,
    },
    {
      url: 'https://blog.airdao.io/',
      iconSrc: mediumIcon,
    },
  ],
};

const App = () => (
  <>
    <HelpMenu 
      {...helpContent}
      appDetails={{
        name: packageJson.name,
        version: packageJson.version,
        lastUpdated: '1 day ago',
      }}
    />
    ...
  </>
)}
```
| Property name |  Default |  Description |
|:-----|:-----------| :------ |
| title **[required]**  |  | Title of the menu which apears at the top of the menu |
| description **[required]**  |  | Description is required and must be a string with length <= 150
| guideLink **[required]**  |  |  This field is required and shoud be an object with fields: ```{ url: PropTypes.string, text: PropTypes.string }```
| video   | ```undefined```  | Object with fields: ```{ links: PropTypes.string, url: PropTypes.string }```
| links   | ```undefined```  | Main navigation for menu, links must be an array of objects with properties url and text with length <= 5
| socials   | ```undefined```  | Social links block: ```{ url: PropTypes.string, iconSrc: PropTypes.string }```
| appDetails   | ```undefined```  | Info which apears at the bottom of the menu: ```{ name: PropTypes.string, version: PropTypes.string, lastUpdated:PropTypes.string }```
