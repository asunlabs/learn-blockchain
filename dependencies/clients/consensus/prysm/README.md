# Learning Prysm essentials

> A full-featured client for the Ethereum Proof-of-Stake protocol, written in Go

> The Prysm project is a Go implementation of the Ethereum protocol as detailed by its official specification. It contains a full beacon node implementation as well as a validator client for participating in blockchain consensus. Prysm utilizes top tools for production servers and interprocess communication, using Google's _gRPC_ library, _BoltDB_ as an optimized, persistent, key-value store, and libp2p by Protocol Labs for all peer-to-peer networking.

> Launched December 1st 2020, eth2 is a publicly accessible network running multiple client implementations participating in Ethereum consensus based on the formal specification for the protocol. The official and only validator deposit contract is 0x00000000219ab540356cbb839cbe05303d7705fa.

## Getting started

> Prysm is an Ethereum proof-of-stake client written in Go. You can use Prysm to participate in Ethereum's decentralized economy by running a node and, if you have 32 ETH to stake, a validator. If you're new to Ethereum, you may enjoy our beginner-friendly Nodes and networks explainer.

## Quickstart: Run a node and (optionally) stake ETH using Prysm

> In this quickstart, you’ll use Prysm to run an Ethereum node and optionally a validator. This will let you stake 32 ETH using hardware that you manage.

> This is a beginner-friendly guide. Familiarity with the command line is expected, but otherwise this guide makes no assumptions about your technical skills or prior knowledge.

> At a high level, we'll walk through the following flow:

1. Configure an execution node using an execution-layer client.
1. Configure a beacon node using Prysm, a consensus-layer client.
1. Configure a validator and stake ETH using Prysm (optional).

### Step 1: Review prerequisites and best practices

**Node type: Execution + beacon**

> 1. Contributes to the security of Ethereum's ecosystem.
> 1. Lets you access the Ethereum network directly without having to trust a third party service.
> 1. Lets you run a validator post-Merge.

To be a fully-working node, you have to consider below requirements.

1. Software: Execution client, beacon node client (instructions for clients below), curl
1. OS: 64-bit Linux, Mac OS X 10.14+, Windows 10+ 64-bit
1. CPU: 4+ cores @ 2.8+ GHz
1. Memory: 16GB+ RAM
1. Storage: SSD with at least 2TB free space
1. Network: 8 MBit/sec broadband

**Node type:Validator**

> 1. Lets you stake ETH, propose + validate blocks, earn staking rewards + transaction fee tips.

To be a validator node, you have to consider below requirements. 

1. Everything above required in fully-working node. 
1. Software: Validator client, browser-based crypto wallet (instructions below)
1. Hardware: (Recommended) A new machine that has never been connected to the internet that you can use to securely generate your mnemonic phrase and keypair
1. 32 ETH (Mainnet/Testnets)

======= 2022.08.16

## Reference 

- [Prysm offical docs](https://prysmaticlabs.com/)
- [Prysm client official docs](https://docs.prylabs.network/docs/getting-started)