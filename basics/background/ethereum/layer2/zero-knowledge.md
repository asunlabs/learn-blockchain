# ZERO-KNOWLEDGE ROLLUPS

> **Zero-knowledge rollups (ZK-rollups) are layer 2 scaling solutions** that increase throughput on Ethereum Mainnet by moving computation and state-storage off-chain. _ZK-rollups can process thousands of transactions in a batch and then only post some minimal summary data to Mainnet_. This summary data defines the changes that should be made to the Ethereum state and some cryptographic proof that those changes are correct.

> PREREQUISITES: You should have read and understood our page on Ethereum scaling and layer 2.

## WHAT ARE ZERO-KNOWLEDGE ROLLUPS?

> Zero-knowledge rollups (ZK-rollups) bundle (or 'roll up') transactions into batches that are executed off-chain. Off-chain computation reduces the amount of data that has to be posted to the blockchain. ZK-rollup operators **submit a summary of the changes required to represent all the transactions in a batch rather than sending each transaction individually**. They also produce validity proofs to prove the correctness of their changes. The validity proof demonstrates with cryptographic certainty that the proposed changes to Ethereum's state are truly the end-result of executing all the transactions in the batch.

> The _ZK-rollup's state_ is maintained by a smart contract deployed on the Ethereum network. To update this state, ZK-rollup nodes must submit a validity proof for verification. As mentioned, the _validity proof is a cryptographic assurance_ that the state-change proposed by the rollup is really the result of executing the given batch of transactions. This means that **ZK-rollups only need to provide validity proofs to finalize transactions on Ethereum** instead of posting all transaction data on-chain like optimistic rollups.

> There are **no delays when moving funds from a ZK-rollup to Ethereum** because exit transactions are executed once the ZK-rollup contract verifies the validity proof. Conversely, withdrawing funds from optimistic rollups is subject to a delay to allow anyone to challenge the exit transaction with a fraud proof.

> **ZK-rollups write transactions to Ethereum as calldata**. calldata is where data that is included in external calls to smart contract functions gets stored. Information in calldata is published on the blockchain, allowing anyone to reconstruct the rollup’s state independently. _ZK-rollups use compression techniques to reduce transaction data_—for example, accounts are represented by an index rather than an address, which saves 28 bytes of data. _On-chain data publication is a significant cost for rollups_, so data compression can reduce fees for users.

## HOW DO ZK-ROLLUPS INTERACT WITH ETHEREUM?

> **A ZK-rollup chain is an off-chain protocol** that operates on top of the Ethereum blockchain and is managed by on-chain Ethereum smart contracts. _ZK-rollups execute transactions **outside of Mainnet**_, but _periodically commit off-chain transaction batches_ to an on-chain rollup contract. This transaction record is immutable, much like the Ethereum blockchain, and forms the ZK-rollup chain.

> The **ZK-rollup's core architecture** is made up of the following components:

> 1. `On-chain contracts`: As mentioned, the ZK-rollup protocol is _controlled by smart contracts running on Ethereum_. This includes `the main contract` which stores rollup blocks, tracks deposits, and monitors state updates. Another `on-chain contract` (the verifier contract) verifies zero-knowledge proofs submitted by block producers. Thus, Ethereum serves as the base layer or "layer 1" for the ZK-rollup.

> 1. `Off-chain virtual machine (VM)`: While the ZK-rollup protocol lives on Ethereum, transaction execution and state storage happen on a separate virtual machine independent of the EVM. **This off-chain VM is the execution environment for transactions** on the ZK-rollup and serves as the secondary layer or "layer 2" for the ZK-rollup protocol. Validity proofs verified on Ethereum Mainnet guarantee the correctness of state transitions in the off-chain VM.

> ZK-rollups are "hybrid scaling solutions"—off-chain protocols that operate independently but derive security from Ethereum. Specifically, the Ethereum network enforces the validity of state updates on the ZK-rollup and guarantees the availability of data behind every update to the rollup's state. As a result, ZK-rollups are considerably safer than pure off-chain scaling solutions, such as sidechains, which are responsible for their security properties, or validiums, which also verify transactions on Ethereum with validity proofs, but store transaction data elsewhere.

> ZK-rollups rely on the main Ethereum protocol for the following:

### Data availability

> ZK-rollups publish state data for every transaction processed off-chain to Ethereum. With this data, it is possible for individuals or businesses to _reproduce the rollup’s state and validate the chain themselves_. Ethereum makes this data available to all participants of the network as `calldata`.

> ZK-rollups don’t need to publish much transaction data on-chain because validity proofs already verify the authenticity of state transitions. Nevertheless, storing data on-chain is still important because it allows permissionless, independent verification of the L2 chain's state which in turn allows anyone to submit batches of transactions, preventing malicious operators from censoring or freezing the chain.

> On-chain is required for users to interact with the rollup. Without access to state data users cannot query their account balance or initiate transactions (e.g., withdrawals) that rely on state information.

### Transaction finality

will be added

### Censorship resistance

will be added

## HOW DO ZK-ROLLUPS WORK?

will be added

### Use ZK-rollups

> Multiple implementations of ZK-rollups exist that you can integrate into your dapps:

## Reference

- [ZERO-KNOWLEDGE ROLLUPS](https://ethereum.org/en/developers/docs/scaling/zk-rollups/)