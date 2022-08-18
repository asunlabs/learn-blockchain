# Learning Hierarchical deterministic wallet essentials

This markdown is based on [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki).

- Deterministic wallet components: 1) a tree of key pairs from seed 2) wallet structure

> This document describes hierarchical deterministic wallets (or "HD Wallets"): wallets which can be shared partially or entirely with different systems, each with or without the ability to spend coins.

> The specification is intended **to set a standard for deterministic wallets** that can be interchanged between different clients. Although the wallets described here have many features, not all are required by supporting clients.

> The specification consists of two parts. In a first part, a system for deriving _a tree of keypairs from a single seed_ is presented. The second part demonstrates how to build _a wallet structure_ on top of such a tree.

> The Bitcoin reference client uses randomly generated keys. In order to avoid the necessity for a backup after every transaction, (by default) 100 keys are cached in a pool of reserve keys. Still, these wallets are not intended to be shared and used on several systems simultaneously. They support hiding their private keys by using the wallet encrypt feature and not sharing the password, but such "neutered" wallets lose the power to generate public keys as well.

> **Deterministic wallets do not require such frequent backups**, and elliptic curve mathematics permit schemes where one can calculate the public keys without revealing the private keys. This permits for example a webshop business to let its webserver generate fresh addresses (public key hashes) for each order or for each customer, _without giving the webserver access to the corresponding private keys_ (which are required for spending the received funds).

> However, deterministic wallets typically consist of **a single "chain" of keypairs**. The fact that there is only one chain means that sharing a wallet happens on an all-or-nothing basis. However, in some cases one only wants some (public) keys to be shared and recoverable. In the example of a webshop, the webserver does not need access to all public keys of the merchant's wallet; only to those addresses which are used to receive customer's payments, and not for example the change addresses that are generated when the merchant spends money. Hierarchical deterministic wallets **allow such selective sharing** by supporting multiple keypair chains, derived from a single root.

## Reference

- []()