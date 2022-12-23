#!/bin/bash

npm install
npm run build
rm -rf ./node_modules/react
rm -rf ./node_modules/react-dom
rm -rf ./node_modules/@web3-react/core
