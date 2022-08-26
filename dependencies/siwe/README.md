# SIGN-IN WITH ETHEREUM

> Your Keys, Your Identifier

## Your Account on Ethereum

> Sign-In with Ethereum is a new form of authentication that enables users to control their digital identity with their Ethereum account and ENS profile instead of relying on a traditional intermediary.

> _Already used throughout web3_, this is an effort to standardize the method with best practices and to **make it easier for web2 services to adopt it**.

**Try it out**

> Check out the latest version of Sign-In with Ethereum by using this example. Connect your wallet, and check out the structure of the latest request as defined by the ongoing work on EIP-4361.

![siwe-vote-emoji](https://user-images.githubusercontent.com/83855174/186871554-fe63199d-4e90-4320-9858-738ce8285e19.png)

**Additional Resources**

> Sign-in With Ethereum was a standard built collaboratively with the greater Ethereum community. For more information on the EIP, check out the following page:

> For more information on Sign-In with Ethereum and its related benefits to both the Web3 ecosystem and Web2 services, check out the following page

## Getting started

> The TypeScript implementation of Sign-In with Ethereum can be found here: 

**Typescript quickstart**

> A Quickstart example using the TypeScript SIWE Library

**Goals**

1. Run a Sign-In with Etheruem example locally
1. Sign-In with Ethereum using a preferred wallet

**Running the quickstart**

> First clone the siwe repository from GitHub by running the following command:

```sh
git clone https://github.com/spruceid/siwe-notepad
```

> Next, enter the directory and run the example by using the following commands: 

```sh
cd siwe-notepad
npm install
npm run dev
```

> Finally, visit the example at http://localhost:4361 (or whichever port npm allocated).

> Once the example has loaded, sign in with Ethereum by clicking on one of the wallet options, enter some text, and save that text. After disconnecting, try reconnecting to reload that text once the session has been reestablished.

## Quick start guide: step by step

> This guide will show how to implement Sign-In with Ethereum (SIWE) in a client-server JavaScript web application.

**Requirements**
​​​
1. Node.js
1. Metamask browser extension wallet
1. An Ethereum account in the installed MetaMask wallet

**Creating SIWE Messages**

> This section describes how to generate Sign-In with Ethereum messages and print them to the console.

> A completed version of this part can be found in the example repository (00_print).

> Creating SIWE messages in JavaScript is straightforward when using the siwe library in npm. To begin, create a new project called siwe-print. 

```sh
mkdir siwe-print && cd siwe-print/
npm init --yes
npm install --save siwe
mkdir src/
```

> We can then write the following into ./src/index.js:

```js
const siwe = require('siwe');

const domain = "localhost";
const origin = "https://localhost/login";

function createSiweMessage (address, statement) {
  const siweMessage = new siwe.SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1'
  });
  return siweMessage.prepareMessage();
}

console.log(createSiweMessage(
    "0x6Ee9894c677EFa1c56392e5E7533DE76004C8D94",
    "This is a test statement."
  ));
```

> Now run the example:

```sh
node src/index.js
```

> You should see output similar to the following message, with different values for the Nonce and Issued At fields:

```
localhost wants you to sign in with your Ethereum account:
0x6Ee9894c677EFa1c56392e5E7533DE76004C8D94

This is a test statement.

URI: https://localhost/login
Version: 1
Chain ID: 1
Nonce: oNCEHm5jzQU2WvuBB
Issued At: 2022-01-28T23:28:16.013Z
```

> The fields we are most interested in for the purposes of this guide are address and statement. address is the Ethereum address which the user is signing in with, and the statement as this will describe to the user what action we wish to perform on their behalf.

> Often, as in this example, we don't need to do any manipulation of the message, so we can immediately convert it into the textual representation that the user will sign.

## Reference

- [Sign in with Ethereum official docs](https://docs.login.xyz/sign-in-with-ethereum/quickstart-guide)