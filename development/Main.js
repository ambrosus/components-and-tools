import React from 'react';
import { Menu } from '../dist/components';
import { useWeb3React } from '@web3-react/core';
import HelpMenuWithContent from './HelpMenuWithContent';

const Main = () => {
  const web3ReactInstance = useWeb3React();

  return (
    <>
      <Menu web3ReactInstance={web3ReactInstance} />
      <HelpMenuWithContent />
    </>
  );
};

export default Main;
