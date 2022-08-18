# ZERO-KNOWLEDGE ROLLUPS

**Takeaways**

1. bundling transactions and executing them at off-chain.
1. off-chain protocol, managed by on-chain smart contracts.
1. periodically commit off-chain transaction executions to on-chain.

> **Zero-knowledge rollups (ZK-rollups) are layer 2 scaling solutions** that increase throughput on Ethereum Mainnet by moving computation and state-storage off-chain. _ZK-rollups can process thousands of transactions in a batch and then only post some minimal summary data to Mainnet_. This summary data defines the changes that should be made to the Ethereum state and some cryptographic proof that those changes are correct.

> PREREQUISITES: You should have read and understood our page on Ethereum scaling and layer 2.

## WHAT ARE ZERO-KNOWLEDGE ROLLUPS?

> Zero-knowledge rollups (ZK-rollups) bundle (or 'roll up') transactions into batches that are executed off-chain. Off-chain computation reduces the amount of data that has to be posted to the blockchain. ZK-rollup operators **submit a summary of the changes required to represent all the transactions in a batch rather than sending each transaction individually**. They also produce validity proofs to prove the correctness of their changes. The validity proof demonstrates with cryptographic certainty that the proposed changes to Ethereum's state are truly the end-result of executing all the transactions in the batch.

> The _ZK-rollup's state is maintained by a smart contract_ deployed on the Ethereum network. To update this state, ZK-rollup nodes must submit a validity proof for verification. As mentioned, the _validity proof is a cryptographic assurance_ that the state-change proposed by the rollup is really the result of executing the given batch of transactions. This means that `ZK-rollups` only need to provide validity proofs to finalize transactions on Ethereum instead of posting all transaction data on-chain like `optimistic rollups`.

> There are **no delays when moving funds from a ZK-rollup to Ethereum** because exit transactions are executed once the ZK-rollup contract verifies the validity proof. Conversely, withdrawing funds from optimistic rollups is subject to a delay to allow anyone to challenge the exit transaction with a fraud proof.

> **ZK-rollups write transactions to Ethereum as calldata**. calldata is where data that is included in external calls to smart contract functions gets stored. Information in calldata is published on the blockchain, allowing anyone to reconstruct the rollup’s state independently. _ZK-rollups use compression techniques to reduce transaction data_—for example, accounts are represented by an index rather than an address, which saves 28 bytes of data. _On-chain data publication is a significant cost for rollups_, so data compression can reduce fees for users.

## HOW DO ZK-ROLLUPS INTERACT WITH ETHEREUM?

> **A ZK-rollup chain is an off-chain protocol** that operates on top of the Ethereum blockchain and is **managed by on-chain Ethereum smart contracts**. _ZK-rollups execute transactions outside of Mainnet_, but _periodically commit off-chain transaction batches_ to an on-chain rollup contract. This transaction record is immutable, much like the Ethereum blockchain, and _forms the ZK-rollup chain_.

> The **ZK-rollup's core architecture** is made up of the following components:

> 1. `On-chain contracts`: As mentioned, the ZK-rollup protocol is _controlled by smart contracts running on Ethereum_. This includes `the main contract` which stores rollup blocks, tracks deposits, and monitors state updates. Another `on-chain contract` (the verifier contract) verifies zero-knowledge proofs submitted by block producers. Thus, Ethereum serves as the base layer or "layer 1" for the ZK-rollup.

> 1. `Off-chain virtual machine (VM)`: While the ZK-rollup protocol lives on Ethereum, **transaction execution and state storage happen on a separate virtual machine independent of the EVM**. _This off-chain VM_ is the execution environment for transactions on the ZK-rollup and _serves as the secondary layer or "layer 2"_ for the ZK-rollup protocol. Validity proofs verified on Ethereum Mainnet guarantee the correctness of state transitions in the off-chain VM.

> `ZK-rollups` are "hybrid scaling solutions"—off-chain protocols that operate independently but derive security from Ethereum. Specifically, the Ethereum network enforces the validity of state updates on the ZK-rollup and guarantees the availability of data behind every update to the rollup's state. As a result, **ZK-rollups are considerably safer than pure off-chain scaling solutions**, such as sidechains, which are responsible for their security properties, or validiums, which also verify transactions on Ethereum with validity proofs, but store transaction data elsewhere.

## ZK-rollups and Ethereum

> ZK-rollups rely on the main Ethereum protocol for the following:

**Data availability**

> **ZK-rollups publish state data for every transaction processed off-chain to Ethereum**. With this data, it is possible for individuals or businesses to _reproduce the rollup’s state and validate the chain themselves_. Ethereum makes this data available to all participants of the network as `calldata`.

> **ZK-rollups don’t need to publish much transaction data on-chain** because validity proofs already verify the authenticity of state transitions. Nevertheless, storing data on-chain is still important because it allows permissionless, independent verification of the L2 chain's state which in turn allows anyone to submit batches of transactions, preventing malicious operators from censoring or freezing the chain.

> **On-chain is required for users to interact with the rollup**. Without access to state data users cannot query their account balance or initiate transactions (e.g., withdrawals) that rely on state information.

**Transaction finality**

> Ethereum acts as a settlement layer for ZK-rollups: L2 transactions are finalized only if the L1 contract accepts the validity proof. This eliminates the risk of malicious operators corrupting the chain (e.g., stealing rollup funds) since every transaction must be approved on Mainnet. Also, **Ethereum guarantees that user operations cannot be reversed once finalized on L1.**

**Censorship resistance**

> Most ZK-rollups use a "supernode" (the operator) to execute transactions, produce batches, and submit blocks to L1. While this ensures efficiency, it increases the risk of censorship: malicious ZK-rollup operators can censor users by refusing to include their transactions in batches.

> As a security measure, **ZK-rollups allow users to submit transactions directly to the rollup contract on Mainnet** if they think they are being censored by the operator. This allows users to force an exit from the ZK-rollup to Ethereum without having to rely on the operator’s permission.

## HOW DO ZK-ROLLUPS WORK?

**Transactions**

> Users in the ZK-rollup sign transactions and submit to L2 operators for processing and inclusion in the next batch. In some cases, the operator is a centralized entity, called a sequencer, who executes transactions, aggregates them into batches, and submits to L1. The sequencer in this system is the only entity allowed to produce L2 blocks and add rollup transactions to the ZK-rollup contract.

> Other ZK-rollups may rotate the operator role by using a proof-of-stake validator set. Prospective operators deposit funds in the rollup contract, with the size of each stake influencing the staker’s chances of getting selected to produce the next rollup batch. The operator’s stake can be slashed if they act maliciously, which incentivizes them to post valid blocks.

**How ZK-rollups publish transaction data on Ethereum**

> As explained, **transaction data is published on Ethereum as calldata**. `calldata` is a data area in a smart contract used to pass arguments to a function and behaves similarly to memory. While _calldata isn’t stored as part of Ethereum’s state_, it persists on-chain as part of the _Ethereum chain's history logs_. calldata does not affect Ethereum's state, making it **a cheap way to store data on-chain**.

<details>
<summary>History logs in Solidity</summary>

> It is possible to store data in a specially indexed data structure that maps all the way up to the block level. This feature called logs is used by Solidity in order to implement events. Contracts cannot access log data after it has been created, but they can be efficiently accessed from outside the blockchain. Since some part of the log data is stored in bloom filters, it is possible to search for this data in an efficient and cryptographically secure way, so network peers that do not download the whole blockchain (so-called “light clients”) can still find these logs.

</details>

> The calldata keyword often identifies the smart contract method being called by a transaction and holds inputs to the method in the form of an arbitrary sequence of bytes

> ZK-rollups use calldata to publish `compressed transaction data` on-chain; **the rollup operator simply adds a new batch by calling the required function in the rollup contract and passes the compressed data as function arguments.** This helps reduce costs for users since a large part of rollup fees go toward storing transaction data on-chain.

**State commitments**

> The ZK-rollup’s state, which includes L2 accounts and balances, is represented as a Merkle tree. A cryptographic hash of the Merkle tree’s root (Merkle root) is stored in the on-chain contract, allowing the rollup protocol to track changes in the state of the ZK-rollup.

> The rollup transitions to a new state after the execution of a new set of transactions. **The operator who initiated the state transition is required to compute a new state root** and submit to the on-chain contract. If the validity proof associated with the batch is authenticated by the verifier contract, the new Merkle root becomes the ZK-rollup’s canonical state root.

> Besides computing state roots, **the ZK-rollup operator also creates a batch root**—the root of a Merkle tree comprising all transactions in a batch. When a new batch is submitted, **the rollup contract stores the batch root**, allowing users to prove a transaction (e.g., a withdrawal request) was included in the batch. Users will have to provide transaction details, the batch root, and a Merkle proof showing the inclusion path.

**Validity proofs**

> **The new state root that the ZK-rollup operator submits to the L1 contract is the result of updates to the rollup’s state**. Say Alice sends 10 tokens to Bob, the operator simply decreases Alice’s balance by 10 and increments Bob’s balance by 10. The operator then hashes the updated account data, rebuilds the rollup's Merkle tree, and submits the new Merkle root to the on-chain contract.

> **But the rollup contract won’t automatically accept the proposed state commitment** until the operator proves the new Merkle root resulted from correct updates to the rollup’s state. The ZK-rollup operator does this by producing a validity proof, a succinct cryptographic commitment verifying the correctness of batched transactions.



## Use ZK-rollups

> Multiple implementations of ZK-rollups exist that you can integrate into your dapps:

1. dYdX
1. Loopring
1. zkSync
1. ZKSpace
1. Aztec

## WHO IS WORKING ON A ZKEVM?

> ZKSync - ZkSync 2.0 is an EVM-compatible ZK Rollup being built by Matter Labs, powered by its own zkEVM

> Polygon Hermez - Hermez 2.0 is a decentralized ZK Rollup on the Ethereum mainnet working on a zero-knowledge Ethereum Virtual Machine (zkEVM) that executes Ethereum transactions in a transparent way, including smart contracts with zero-knowledge-proof validations.



> 

## Reference

- [ZERO-KNOWLEDGE ROLLUPS](https://ethereum.org/en/developers/docs/scaling/zk-rollups/)