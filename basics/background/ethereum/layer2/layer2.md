# Learning layer 2 solution for scailability

> As we mentioned above, Layer 2 is a collective term for Ethereum scaling solutions that handle transactions off Ethereum layer 1 while still taking advantage of the robust decentralized security of Ethereum layer 1. A layer 2 is a separate blockchain that extends Ethereum. How does that work?

> A layer 2 blockchain regularly communicates with Ethereum (by submitting bundles of transactions) in order to ensure it has similar security and decentralization guarantees. All this requires no changes to the layer 1 protocol (Ethereum). This lets layer 1 handle security, data availability, and decentralization, while layer 2s handles scaling. Layer 2s take the transactional burden away from the layer 1 and post finalized proofs back to the layer 1. By removing this transaction load from layer 1, the base layer becomes less congested, and everything becomes more scalable.

## Rollups

> Rollups are currently the preferred layer 2 solution for scaling Ethereum. By using rollups, users can reduce gas fees by up to 100x compared to layer 1.

> Rollups bundle (or ’roll up’) hundreds of transactions into a single transaction on layer 1. This distributes the L1 transaction fees across everyone in the rollup, making it cheaper for each user. Rollup transactions get executed outside of layer 1 but the transaction data gets posted to layer 1. By posting transaction data onto layer 1, rollups inherit the security of Ethereum. **There are two different approaches to rollups: optimistic and zero-knowledge** - they differ primarily on **how this transaction data is posted to L1**.

> 

## Reference

- https://ethereum.org/en/layer-2/#:~:text=A%20layer%202%20is%20a%20separate%20blockchain%20that%20extends%20Ethereum.&text=A%20layer%202%20blockchain%20regularly,layer%201%20protocol%20(Ethereum)