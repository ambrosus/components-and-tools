import React from 'react';
import { Menu } from '../dist/components';
import { useAutoLogin } from '../dist/hooks';
import { useWeb3React } from '@web3-react/core';
import HelpMenuWithContent from './HelpMenuWithContent';

const Main = () => {
  const web3ReactInstance = useWeb3React();
  const { isLoaded } = useAutoLogin(web3ReactInstance);

  return (
    <>
      <Menu web3ReactInstance={web3ReactInstance} />
      <section>{JSON.stringify(web3ReactInstance, null, 2)}</section>
      <HelpMenuWithContent />
    </>
  );
};

export default Main;
