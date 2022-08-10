# Learning Ethereum Beacon chain essentials

> The Beacon Chain doesn't change anything about the Ethereum we use today.

1. It introduced **proof-of-stake** to the Ethereum ecosystem.
1. It will coordinate the network, serving as **the consensus layer**.
1. It is an essential precursor to upcoming scaling upgrades, such as sharding.

## What does the Beacon Chain do?

> The Beacon Chain is a ledger of accounts that conducts and coordinates the network of stakers. It isn't quite like the Ethereum Mainnet of today. It does not process transactions or handle smart contract interactions.

> It is a new consensus engine (or "consensus layer") that will soon take the place of proof-of-work mining, bringing many significant improvements with it.

> The Beacon Chain's role will change over time, but it's a foundational component for the secure, environmentally friendly and scalable Ethereum we’re working towards.

## Beacon Chain impact

**Introducing staking**

> The Beacon Chain introduced proof-of-stake to Ethereum. This is a new way for you to help keep Ethereum secure. Think of it like a public good that will make Ethereum healthier and earn you more ETH in the process. In practice, staking involves you staking ETH in order to activate validator software. **As a staker, you'll run node software that processes transactions and creates new blocks in the chain**.

> Staking serves a similar purpose to mining, but is different in many ways. **Mining requires** large up-front expenditures in the form of powerful hardware and energy consumption, resulting in economies of scale, and promoting **centralization**. Mining also does not come with any requirement to lock up assets as collateral, limiting the protocol's ability to punish bad actors after an attack.

> The transition to proof-of-stake will make Ethereum significantly more secure and decentralized by comparison. The more people that participate in the network, the more decentralized and safe from attacks it becomes.

**The Merge and the end of mining**

> While the Beacon Chain (or "consensus layer") is already live, it has existed as a separate chain from Mainnet (or the "**execution layer**") since its genesis. The plan is to swap out the current proof-of-work algorithm on the execution layer today and replace it with the proof-of-stake consensus protocol that the Beacon Chain provides.

> This process is known as The Merge, as it will **'merge' the new consensus layer with the existing execution layer and stop the use of mining**.

> The Merge will have an immediate and **profound impact on the carbon footprint of the Ethereum network**. It also sets the stage for future **scalability** upgrades such as **sharding**.

## Setting up for sharding

> After Mainnet merges with the Beacon Chain, **the next major upgrade will introduce sharding to the network**.

> Proof-of-stake has the advantage of **having a registry of all approved block producers at any given time, each with ETH at stake**. This registry sets the stage for the ability to divide and conquer but reliably split up specific network responsibilities.

> This responsibility is in contrast to **proof-of-work**, where **miners have no obligation to the network and could stop mining** and turn their node software off permanently in an instant without repercussion. There is also no registry of known block proposers and no reliable way to split network responsibilities safely.

## Relationship between upgrades

> **The Ethereum upgrades are all somewhat interrelated**. So let’s recap how the Beacon Chain affects the other upgrades.

**Beacon Chain and The Merge**

> The Beacon Chain, at first, will exist separately to the Ethereum Mainnet we use today. But eventually they will be connected. The plan is to "merge" Mainnet into the proof-of-stake system that's controlled and coordinated by the Beacon Chain.

**Shards and the Beacon Chain**

> **Sharding can only safely enter** the Ethereum ecosystem **with a proof-of-stake** consensus mechanism in place. The **Beacon Chain introduced staking**, which when 'merged' with Mainnet will pave the way for sharding to help further scale Ethereum.

## Interact with the Beacon Chain

> Become a **staker**: Staking is live! If you want to stake your ETH to help secure the network, make sure you’re aware of the risks.

> Run a **consensus client**: Ethereum needs as many clients running as possible. Help with this Ethereum public good!

## Get involved in upgrading Ethereum 

> Here's all the ways you can help with Ethereum and future upgrade-related efforts.

**How do you want to get involved?**

1. Run a client: Running a client means you'll be an active participant in Ethereum. Your client will help keep track of transactions and check new blocks.

1. Stake your ETH: If you have ETH, you can stake it to become a validator and help secure the network. As a **validator** you can **earn ETH rewards**.

### Run a client pair

- Ethereum 2.0 clients: 1) execution layer client 2) consensus layer client 

> A 'client' is software that runs the blockchain, and in the case of Ethereum, **a full node requires running a pair of these clients**: an _execution layer client_ and a _consensus layer client_. **A full node can check transactions and, if also staking ETH, can create new blocks**. Each client has its own features but performs the same function overall, so we encourage you to choose a minority client whenever possible to keep the client pool diverse and secure.

**Execution layer clients**

> These clients were formerly referred to as 'Eth1' clients, but this term is being deprecated in favor of `'execution layer'` clients.

1. Besu(written in Java)
1. Geth(written in Go)
1. Nethermind(written in C#)
1. Erigon(writtne in Go)

**Consensus layer clients**

> These clients were formerly referred to as 'Eth2' clients, but this term is being deprecated in favor of '`consensus layer`' clients.

1. Prysm(written in Go)
1. Nimbus(written in Nim)
1. Lighthouse(written in Rust)
1. Teku(written in Java)
1. Lodestar(written in Javascript, review and audit in progress)

## Reference 

- [The Beacon Chain](https://ethereum.org/en/upgrades/beacon-chain/)
- [Get involved in upgrading Ethereum](https://ethereum.org/en/upgrades/get-involved/)

