# Learning zkSync Essentials

> Rely on math, not validators

> zkSync is Ethereum’s most user-centric ZK rollup zkSync solves Ethereum scalability with zero security compromises

> zkSync is a mission-driven project. Its purpose is to break financial barriers and enhance world’s freedom — by **accelerating the mass adoption of public blockchains**. 

## Introduction to zkSync for Developers

> zkSync is a scaling and privacy engine for Ethereum. Its current functionality scope includes low gas transfers of ETH and ERC20 tokens in the Ethereum network, atomic swaps & limit orders as well as native L2 NFT support. This document is a high-level description of the zkSync development ecosystem.

> zkSync is built on ZK Rollup architecture. ZK Rollup is an L2 scaling solution in which _all funds are held by a smart contract on the mainchain_, while _computation and storage are performed off-chain_. For every Rollup block, a state transition zero-knowledge proof (SNARK) is generated and verified by the mainchain contract. This SNARK includes the proof of the validity of every single transaction in the Rollup block. Additionally, the public data _update for every block is published over the mainchain network in the cheap calldata_.

> This architecture provides the following guarantees:

1. The Rollup validator(s) can never corrupt the state or steal funds (unlike Sidechains).

1. Users can always retrieve the funds from the Rollup even if validator(s) stop cooperating because the data is available (unlike Plasma).

1. Thanks to validity proofs, neither users nor a single other trusted party needs to be online to monitor Rollup blocks in order to prevent fraud (unlike payment channels or Optimistic Rollups).

> In other words, ZK Rollup strictly inherits the security guarantees of the underlying L1.

## Capabilities

> First of all, zkSync, as a scaling solution, is capable of making transfers, and doing them quick and cheap. Interfaces and principles of the `core zkSync functionality` are covered in the `payments section` of this documentation.

> Secondly, zkSync is smart-contract friendly. As of February 2022, zkSync 2.0 testnet has been live featuring smart contracts in Solidity or reusing existing Solidity code. `Contracts interoperability` is covered in the `contracts section` and you can find more details in the zkSync 2.0 Documentation

>  Thirdly, zkSync is friendly for exchanges. `Atomic swaps` — an essential component of exchange protocols — are already available on mainnet!

> Fourthly, zkSync has `native support of NFTs`. You can try it out in our wallet (opens new window).

> Finally, zkSync support is `implemented for all the main platforms`. Check out our SDK section of docs, and start developing with zkSync!

<details>
<summary>zkSync SDK</summary>

JavaScript / TypeScript
Rust
Android (Java)
iOS (Swift)
Python
Dart This is an unofficial open-sourced SDK for zkSync
</details>

## Reference

- [ZKSync official](https://zksync.io/)