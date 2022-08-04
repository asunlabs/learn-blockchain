# Learning layer 2 solution for scailability

> As we mentioned above, Layer 2 is a collective term for Ethereum scaling solutions that handle transactions off Ethereum layer 1 while still taking advantage of the robust decentralized security of Ethereum layer 1. A layer 2 is a separate blockchain that extends Ethereum. How does that work?

> A layer 2 blockchain regularly communicates with Ethereum (by submitting bundles of transactions) in order to ensure it has similar security and decentralization guarantees. All this requires no changes to the layer 1 protocol (Ethereum). This lets layer 1 handle security, data availability, and decentralization, while layer 2s handles scaling. Layer 2s take the transactional burden away from the layer 1 and post finalized proofs back to the layer 1. By removing this transaction load from layer 1, the base layer becomes less congested, and everything becomes more scalable.

## Rollups

> Rollups are currently the preferred layer 2 solution for scaling Ethereum. By using rollups, users can reduce gas fees by up to 100x compared to layer 1.

> Rollups bundle (or ’roll up’) hundreds of transactions into a single transaction on layer 1. This distributes the L1 transaction fees across everyone in the rollup, making it cheaper for each user. Rollup transactions get executed outside of layer 1 but the transaction data gets posted to layer 1. By posting transaction data onto layer 1, rollups inherit the security of Ethereum. **There are two different approaches to rollups: optimistic and zero-knowledge** - they differ primarily on **how this transaction data is posted to L1**.

### Do your own research: risks of layer 2

> Since layer 2 chains inherit security from Ethereum, in an ideal world, they are as safe as L1 Ethereum. However, many of the projects are still young and somewhat experimental. After years of research and development, many of the L2 technologies that will scale Ethereum launched in 2021. Many projects still have additional trust assumptions as they work to decentralize their networks. Always do your own research to decide if you're comfortable with any risks involved.

> For more information on the technology, risks, and trust assumptions of layer 2s, we recommend checking out L2BEAT, which provides a comprehensive risk assessment framework of each project.

## Use layer 2

> Now that you understand why layer 2 exists and how it works, let's get you up and running!

> NOTE: When bridging over and using layer 2, it is important to note that you will control the address for your EOA account (an account where only a single private key controls the account) just like on Ethereum Mainnet. However, if you are using a contract account, such as Gnosis Safe or Argent, you will not have control over this address on a layer 2 until you redeploy your contract account to that address on the layer 2. If you are bridging or sending funds to a contract account, and you do not control this address for the contract account, your funds may be lost.

> NOTE: When bridging over and using layer 2, it is important to note that you will control the address for your EOA account (an account where only a single private key controls the account) just like on Ethereum Mainnet. However, if you are using a contract account, such as Gnosis Safe or Argent, you will not have control over this address on a layer 2 until you redeploy your contract account to that address on the layer 2. If you are bridging or sending funds to a contract account, and you do not control this address for the contract account, your funds may be lost.

### Generalized layer

> Generalized layer 2s behave just like Ethereum — but cheaper. Anything that you can do on Ethereum layer 1, you can also do on layer 2. Many dapps have already begun to migrate to these networks or have skipped Mainnet altogether to deploy straight on a layer 2.

### Application specific layer

> Application specific layer 2s are projects that specialize in optimizing for a specific application space, bringing improved performance.

### A note on sidechains, validiums, and alternative blockchains

> Sidechains and validiums are blockchains that allow assets from Ethereum to be bridged over and used on another blockchain. Sidechains and validiums run in parallel with Ethereum, and interact with Ethereum through bridges, but they do not derive their security or data availability from Ethereum.

> Both scale similarly to layer 2s - they offer lower transaction fees and higher transaction throughput - but have different trust assumptions.

> Some layer 1 blockchains have higher throughput and lower transaction fees than Ethereum. These alternative layer 1s have had to sacrifice on security or decentralization in order to achieve higher transactions per second and lower transaction fees.

> The Ethereum ecosystem is firmly aligned that layer 2 scaling is the only way to solve the scalability trilemma while remaining decentralized and secure.

## How to get onto a layer 2

> There are two primary ways to get your assets onto a layer 2: bridge funds from Ethereum via a smart contract or withdraw your funds on an exchange directly onto the layer 2 network.

**Funds in your wallet?**

> If you've already got your ETH in your wallet, you'll need to use a bridge to move it from Ethereum Mainnet to a layer 2.

**Funds on an exchange?**

> Some centralized exchanges now offer direct withdrawals and deposits to layer 2s. Check which exchanges support layer 2 withdrawals and which layer 2s they support.
> You'll also need a wallet to withdraw your funds to. Find an Ethereum wallet.

<details>
<summary>Why is there no 'official' Ethereum L2?</summary>

> Just as there is no 'official' Ethereum client, there is no 'official' Ethereum layer 2. Ethereum is permissionless - technically anyone can create a layer 2! Multiple teams will implement their version of a layer 2, and the ecosystem as a whole will benefit from a diversity of design approaches that are optimized for different use cases. Much like we have multiple Ethereum clients developed by multiple teams in order to have diversity in the network, this too will be how layer 2s develop in the future.
</details>

<details>
<summary>What is the difference between optimistic and zero-knowledge rollups?</summary>

> Both optimistic and zero-knowledge rollups bundle (or ’roll up’) hundreds of transactions into a single transaction on layer 1. Rollup transactions get executed outside of layer 1 but transaction data gets posted to layer 1.

> The primary difference is what data is posted to the layer 1 and how the data is verified. Validity proofs (used by zero-knowledge rollups) run the computations off-chain and post a proof, whereas fault proofs (used by optimistic rollups) only run the computations on-chain when fault is suspected and must be checked.

> At the moment, most zk-rollups are application specific, in contrast with optimistic rollups which have largely been generalizable.

</details>

<details>
<summary>Is scaling at layer 1 possible?</summary>

> Yes. Currently in the Ethereum roadmap there are plans for shard chains. While these are in the roadmap, further scaling through layer 2 networks is still necessary.
</details>

<details>
<summary>What are the risks with layer 2?</summary>

> Layer 2 projects contain additional risks compared to holding funds and transacting directly on Ethereum Mainnet. For instance, sequencers may go down, leading you to have to wait to access funds.

> We encourage you to do your own research before transferring significant funds to a layer 2. For more information on the technology, risks, and trust assumptions of layer 2s, we recommend checking out L2BEAT, which provides a comprehensive risk assessment framework of each project.

> Blockchain bridges, which facilitate asset transfers to layer 2, are in their early stages of development and it is likely that the optimal bridge design has not been discovered yet. There have been recent hacks of bridges.

</details>

## Reference

- https://ethereum.org/en/layer-2/#:~:text=A%20layer%202%20is%20a%20separate%20blockchain%20that%20extends%20Ethereum.&text=A%20layer%202%20blockchain%20regularly,layer%201%20protocol%20(Ethereum)