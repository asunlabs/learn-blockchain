# Learning Quicknode Essentials

> Blockchain infrastructure for everyone: We make it simple to build blockchain applications and scale up as you grow. From elastic APIs to powerful tools and analytics, all at your command through a simple control panel.

> Nodes & related infrastructure are critical for developing and operating in the Web3 space. It can be confusing to decide on the best provider based on price for what you get. We compare 3 popular providers, show overage costs, and lay out some real world comparison scenarios.

## QuickNode Ethereum RPC Overview

> At QuickNode, we run Ethereum RPC endpoints. In aggregate we serve 100s of billions requests every month. To make it easier for developers to integrate with QuickNode, we've created this documentation that shows how to call RPC methods using libraries in Python, Ruby, JavaScript, cURL.

> With QuickNode, you get access to our global network which always routes your API requests to the nearest available location, ensuring low latency and fastest speeds.

## Authentication Options

> Token Authentication - By default, all endpoints created on QuickNode are protected by a token in the URL which looks something like this:

> Please note the / at the end of the URL. Without it, you will receive 404 errors.

```
http://sample-endpoint-name.network.quiknode.pro/token-goes-here/
```

> Approved Referrer List - For endpoints on the shared network, you are able to add a list of approved referrers. This requires any HTTP request to send a REFERRER header or any WebSocket request to send a ORIGIN header populated with one of the referrers you entered into our user panel.

> Disabling Token Authentication - You can also disable the token authentication completely in your security settings for a given endpoint. This will allow anyone to make requests to the endpoint without the token.

> JWT (JSON Web Tokens) - For additional security, you can also enable JWT for each of your deployed endpoints. JWT allows for stateless authentication between you and your endpoint. Learn how to use JWT with QuickNode in this step-by-step guide.

> Multiple Authentication Tokens - Create multiple authentication tokens for each of your deployed endpoints. This allows you to revoke any tokens that may be comprised, without needing to restart your non-compromised endpoint.

> To roll an individual authentication token, create an additional token and then delete the previous token. Learn more about multiple authentication tokens in this QuickNode guide.

## Installing cURL and Web3 SDKs

### cURL

> Most *nix based systems have cURL support out of the box. cURL is a command line tool and library for transferring data with URLs. Check if you have it by running the following:

```sh
curl -h
```

### Ethers.js

> At QuickNode we prefer ethers.js as our JS library for interacting with JSON-RPCs when possible. Ethers aims to be a complete and compact library for interacting with the Ethereum Blockchain and its ecosystem. If you'd like to use it, please be sure to install it like so:

## API credits

> Usage in our new pricing plans is measured in API Credits. Some methods have an API Credit value greater than 1: eth_getLogs has a value of 6, for example. API Credit values are based on the intensity that the method has on the platform and varies based on a number of complex factors (like compute, memory, disk, and network resources).

> We’re very excited as we develop and ship new features at QuickNode. As of July 7th, 2022, all newly launched features will have an associated API Credit per method. In the future, by using this model, we will also be able to offer price reductions or make some features available for free for our users.

### Archive Multiplier

> Archive data is data from very early blocks which require separate infrastructure to power archive requests from our customers - read more about full versus archive nodes in this QuickNode guide.

> As of July 7th, 2022 , archive data is included in all plans!

```
Archive Method Multiplier	4
```

> We apply a multiplier to the API Credit for all calls made to the archive. For example, the eth_getBalance method has an API Credit of 2. This method called against the archive would be the API Credit * the archive multiplier (2 * 4 = 8).

## Reference

- [Deep Dive Comparison: Infura, Alchemy, QuickNode](https://blog.quicknode.com/price-compare-infura-alchemy-quiknode/)
- [QuickNode Ethereum RPC Overview](https://www.quicknode.com/docs/ethereum)