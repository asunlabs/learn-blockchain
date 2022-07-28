# Learning NFT swap SDK with 0x

> Swap SDK is a light, performant library built with ethers to easily interact with the 0x v4 protocol. Swap SDK also offers a free, managed orderbook so you don't need to worry about building off-chain order persistance (unless you want to). Swap SDK provides all the functionality to build an NFT marketplace or peer-to-peer swap application, including building orders, approving orders, persisting orders, and filling orders. Just add a UI!

> Swap SDK is a library made by developers for developers. Swap SDK is fully funded by a 0x DAO grant. We plan to support and mature this library, as well as continue to open-source more tooling, so developers can integrate the SwapSDK confidently.

> NFT Swap SDK now supports 0x Protocol v4! Try it out on Ethereum Mainnet today.

> Swapping with the Swap SDK just got even better. With the new integration of 0x v4, NFT trades that use the Swap SDK are the cheapest and most efficient swaps available on Ethereum. Leverage the updated Swap SDK to ensure your users have the lowest possible gas fees anywhere. Read more about the gas optimizations below.

> 0x v4 NFT is available on Ethereum Mainnet, Polygon, Optimism, BSC, Fantom, and Celo, and Ropsten Testnet. Arbitrum will be supported very soon and just awaiting final deployment.

> Swap SDK allows developers to build NFT swap functionality into their Ethereum (or EVM-compatible chains) applications quickly and easily. Whether you're building a wallet, an NFT marketplace, or a peer-to-peer swap application, Swap SDK makes integrating NFT swap functionality easy and lightweight. Just add your UI!

> Whether you prefer on-chain or off-chain orders, 0x v4 is the cheapest and most efficient way to swap NFTs to date.

> Since Swap SDK uses 0x v4 protocol under the hood, the Swap SDK is the the most gas-efficient and cheapest way to swap NFTs on Ethereum. Build your app confidently knowing you're offering your users the best swapping experience available.

> Based on recent gas benchmarks, 0x v4 is significantly cheaper to fill orders.

- 40% cheaper than OpenSea, LooksRare, and Rarible for buying NFTs
- 35% cheaper than Zora to fill (>60% cheaper than Zora if including both parties' gas fees)

> 0x v4 supports both on-chain listings and off-chain listings so you can choose the best approach for your application.

> 0x v4 initially includes a rich set of swap functionality. More swap functionality (e.g. bundles) will be added over time

- ERC721 <> ERC20 swap
- ERC1155 <> ERC20 swap

> NFT buys and sells (bids and asks) are both supported.

> Note: Currently 0x v4 does not support NFT<>NFT swaps (e.g. ERC721<>ERC721). If required, you can use the 0x v3 protocol until v4 support is added.

## Quick start

> Let's walk through the most common NFT swap case: swapping an NFT (ERC721 or ERC1155) with an ERC20.

```ts
import { NftSwapV4 } from '@traderxyz/nft-swap-sdk'

// Scenario: User A wants to sell their CryptoPunk for 420 WETH

// Set up the assets we want to swap (CryptoPunk #69 and 420 WETH)
const CRYPTOPUNK = {
  tokenAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
  tokenId: '69',
  type: 'ERC721', // 'ERC721' or 'ERC1155'
}
const FOUR_HUNDRED_TWENTY_WETH = {
  tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', // WETH contract address
  amount: '420000000000000000000', // 420 Wrapped-ETH (WETH is 18 digits)
  type: 'ERC20',
}

// [Part 1: Maker (owner of the Punk) creates trade]
const nftSwapSdk = new NftSwapV4(provider, signerForMaker, CHAIN_ID)
const walletAddressMaker = '0x1234...'

// Approve NFT to trade (if required)
await nftSwapSdk.approveTokenOrNftByAsset(CRYPTOPUNK, walletAddressMaker)

// Build order
const order = nftSwapSdk.buildOrder(
  CRYPTOPUNK, // Maker asset to swap
  FOUR_HUNDRED_TWENTY_WETH, // Taker asset to swap
  walletAddressMaker
)
// Sign order so order is now fillable
const signedOrder = await nftSwapSdk.signOrder(order)

// [Part 2: Taker that wants to buy the punk fills trade]
const nftSwapSdk = new NftSwap(provider, signerForTaker, CHAIN_ID)
const walletAddressTaker = '0x9876...'

// Approve USDC to trade (if required)
await nftSwapSdk.approveTokenOrNftByAsset(FOUR_HUNDRED_TWENTY_WETH, walletAddressTaker)

// Fill order :)
const fillTx = await nftSwapSdk.fillSignedOrder(signedOrder)
const fillTxReceipt = await nftSwapSdk.awaitTransactionHash(fillTx.hash)
console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`)
```

> That's it! More examples and advanced usage can be found in the examples documentation.
