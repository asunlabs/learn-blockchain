# Getting started with Matic.js

> To get started, check the latest Matic.js documentation.

> The matic.js SDK takes all the computing power of Polygon and places it right at your finger tip. With custom-made functions that allow for approval, deposit and withdrawals, all without doing too much footwork. Our reason for engineering this was to ensure you get instant value from our platform.

## Contents

1. [Installation](#installation)

## Installation

> The first step to using the awesome power of Polygon via our SDK is by doing an NPM install of it. Find here.

```sh
npm install @maticnetwork/maticjs
npm install @maticnetwork/maticjs-web3
npm install @maticnetwork/maticjs-ethers
```

## Usage

> To access the SDK, import it in your application using

```js
import { use } from '@maticnetwork/maticjs'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3'
import HDWalletProvider from "@truffle/hdwallet-provider"

// install web3 plugin
use(Web3ClientPlugin)
```

> The providers can be RPC urls or web3 based providers like Metamask provider, HDWalletProvider etc. based on requirement. For more information, please have a look at the Matic.js documentation on PoS.

```js 
// for mumbai testnet
const getPOSClient = (network = 'testnet', version = 'mumbai') => {
  const posClient = new POSClient();

await posClient.init({
    network: <network name>,  // 'testnet' or 'mainnet'
    version: <network version>, // 'mumbai' or 'v1'
    parent: {
      provider: <parent provider>,
      defaultConfig: {
            from: <from address>
      }
    },
    child: {
      provider: <child provider>,
      defaultConfig: {
            from: <from address>
      }
    }
});
```

## Reference

- [Polygon - Getting Started with Matic.js](https://wiki.polygon.technology/docs/develop/ethereum-polygon/pos/using-sdk/getting-started)