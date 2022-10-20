# Ethereum Full Node vs Archive Node

## Overview 

> Ethereum runs on a network of computers (also known as nodes) that verify transactions based on a consensus protocol and ledger, which make up the blockchain. In this guide, you will learn more about nodes, the types of nodes, and then explore the requirements needed to run them.

## What You Will Need

- Basic understanding of Ethereum

## What You Will Do

- Learn about Nodes on Ethereum
- Learn about Full Nodes
- Learn about Archive Nodes
- Explore the different Ethereum clients
- Learn about recommended hardware requirements

## What is a Node in Ethereum?

> A node is a computer that runs the Ethereum client software and is connected to other nodes on the network. These nodes work together to verify transactions and verify the common blockchain database known as a ledger. There are different types of nodes and client software programs with different features and purposes, which we will dive into shortly. 

> Here are the key takeaways for Full and Archive nodes on Ethereum:

> 1. Full Node: Stores and maintains the full blockchain data on disk. It serves blockchain data upon request and helps support the network by participating in block validation and by verifying all blocks and states. All states can be derived from a Full node.

![full node](https://user-images.githubusercontent.com/113868816/196838701-171db1fb-7608-4a97-8b44-2fee8461f77d.png)

> 1. Archive Node: Inherits the same capabilities as Full nodes and also builds an archive of historical states. This type of node is useful when querying historical blockchain data that is not accessible on Full nodes. Archive nodes aren’t required to participate in block validation and can be built from scratch using a Full node.

> The storage capacity required for running an Archive node is higher since you store an archive of historical states. Currently, the storage needed for running an Archive node is around ~12 TB on Geth and ~2 TB on Erigon (which will grow over time). Also, keep in mind that the database size and synchronization speed will vary for each client and its configuration.

![archive node](https://user-images.githubusercontent.com/113868816/196838863-72ccdcc0-0c25-4cc6-b4b5-2824eb40eaa2.png)

## Benefits of Running a Node

> Running a node (i.e., Full node) helps keep the network more diverse and decentralized. It also lets you directly interact with Ethereum without relying on other nodes.

> Alternatively, if you don't want to manage the hardware and software requirements of running a node, you can easily get optimized access to an Ethereum endpoint with QuickNode for free! QuickNode offers access to over 15 blockchains and counting! 

> QuickNode also has a subset of enhanced APIs that allow for easy querying of aggregated blockchain data (e.g., ERC-721, ERC-20 data). Just create an account for free, then click the Create Endpoint button and select the Ethereum mainnet chain. Once your endpoint is ready, copy the HTTP Provider URL for read and write access to the Ethereum blockchain.

> Note that Archive requests on QuickNode are included in all plans and use up API Credits. However, an add-on is required if you created your QuickNode account before July 25, 2022.

## Reference 

- [QuickNode - Ethereum Full Node vs Archive Node](https://www.quicknode.com/guides/infrastructure/ethereum-full-node-vs-archive-node)
- [QuickNode - Ethereum Full Node vs Archive Node](https://www.quicknode.com/guides/infrastructure/ethereum-full-node-vs-archive-node)