import React from 'react';
import { Menu } from '../dist/components';
import { useAutoLogin } from '../dist/hooks';
import { useWeb3React } from '@web3-react/core';
import HelpMenuWithContent from './HelpMenuWithContent';
import { metamaskConnector, walletconnectConnector } from '../dist/utils';

const Main = () => {
  const web3ReactInstance = useWeb3React();
  const { isLoaded } = useAutoLogin(web3ReactInstance);
  console.log(web3ReactInstance);

  return (
    <>
      <Menu
        metamaskConnector={metamaskConnector}
        walletconnectConnector={walletconnectConnector}
      />
      <section style={{ height: '100vh', paddingLeft: '45vw' }}>
        {/*{JSON.stringify(web3ReactInstance, null, 2)}*/}
      </section>
      <HelpMenuWithContent />
    </>
  );
};

export default Main;
