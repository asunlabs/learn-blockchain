# Run a Ethereum client pair

- Ethereum 2.0 clients: 1) execution layer client 2) consensus layer client 

> A 'client' is software that runs the blockchain, and in the case of Ethereum, **a full node requires running a pair of these clients**: an _execution layer client_ and a _consensus layer client_. **A full node can check transactions and, if also staking ETH, can create new blocks**. Each client has its own features but performs the same function overall, so we encourage you to choose a minority client whenever possible to keep the client pool diverse and secure.

**Execution layer clients**

> These clients were formerly referred to as 'Eth1' clients, but this term is being deprecated in favor of `'execution layer'` clients.

1. Besu(written in Java)
1. _Geth(written in Go)_
1. Nethermind(written in C#)
1. Erigon(writtne in Go)

**Consensus layer clients**

> These clients were formerly referred to as 'Eth2' clients, but this term is being deprecated in favor of '`consensus layer`' clients.

1. _Prysm(written in Go)_
1. Nimbus(written in Nim)
1. Lighthouse(written in Rust)
1. Teku(written in Java)
1. Lodestar(written in Javascript, review and audit in progress)