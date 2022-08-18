# Ethereum PoS update 

- Ethereum massive updates: 1) PoS 2) Rollups/Layer2 3) Sharding

> Soon, the current Ethereum Mainnet will merge with the Beacon Chain proof-of-stake system. This will mark the end of proof-of-work for Ethereum, and the full transition to proof-of-stake. This sets the stage for future scaling upgrades including sharding. The Merge will reduce Ethereum's energy consumption by ~99.95%.

## WHEN'S IT SHIPPING?

**~Q3/Q4 2022**

> The Merge is **the most significant upgrade** in the history of Ethereum. Extensive testing and bug bounties were undertaken to ensure a safe transition to proof-of-stake. This process is in its final stages, with plans to undergo The Merge on a few public testnets before finally moving forward with Mainnet. If you're excited about The Merge, follow the EF Blog or the client communication channels for the latest official word on When Merge?

## What is The Merge?

- Merge = Ethereum mainnet layer(PoS) + Beacon chain(PoS)

> The Merge represents the joining of the existing execution layer of Ethereum (the Mainnet we use today) with its new proof-of-stake consensus layer, the Beacon Chain. It **eliminates the need for energy-intensive mining** and instead secures the network using staked ETH. A truly exciting step in realizing the Ethereum vision – more scalability, security, and sustainability.

![image](https://user-images.githubusercontent.com/83855174/182559604-b4e1f0d0-c4c7-48da-ada1-d96da5359a1f.png)

> It's important to remember that initially, the Beacon Chain shipped separately from Mainnet. Ethereum Mainnet - with all it's accounts, balances, smart contracts, and blockchain state - continues to be secured by proof-of-work, even while the Beacon Chain runs in parallel using proof-of-stake. The approaching Merge is when these two systems finally come together, and proof-of-work is replaced permanently by proof-of-stake.

> Let's consider an analogy. Imagine Ethereum is a spaceship that isn't quite ready for an interstellar voyage. With the Beacon Chain, the community has built a new engine and a hardened hull. After significant testing, it's almost time to hot-swap the new engine for the old mid-flight. This will merge the new, more efficient engine into the existing ship, ready to put in some serious lightyears and take on the universe.

> Let's consider an analogy. Imagine Ethereum is a spaceship that isn't quite ready for an interstellar voyage. With the Beacon Chain, the community has built a new engine and a hardened hull. After significant testing, it's almost time to hot-swap the new engine for the old mid-flight. This will merge the new, more efficient engine into the existing ship, ready to put in some serious lightyears and take on the universe.

## Merging with Mainnet

> Since genesis, proof-of-work has secured Mainnet. This is the Ethereum blockchain we're all used to—it contains every transaction, smart contract, and balance since it began in July 2015.

> Throughout Ethereum's history, developers have been hard at work preparing for an eventual transition away from proof-of-work to proof-of-stake. On December 1, 2020, the Beacon Chain was created, which has since existed as a separate blockchain to Mainnet, running in parallel.

> The Beacon Chain has not been processing Mainnet transactions. Instead, it has been reaching consensus on its own state by agreeing on active validators and their account balances. After extensive testing, the Beacon Chain's time to reach consensus on more is rapidly approaching. After The Merge, the Beacon Chain will be the consensus engine for all network data, including execution layer transactions and account balances.

> The Merge represents the official switch to using the Beacon Chain as the engine of block production. Mining will no longer be the means of producing valid blocks. Instead, the proof-of-stake validators assume this role and will be responsible for processing the validity of all transactions and proposing blocks.

> No history is lost. As Mainnet gets merged with the Beacon Chain, it will also merge the entire transactional history of Ethereum. You don't need to do anything. Your funds are safe.

## What do I need to do to get ready?

> The Merge is one of the most significant and anticipated upgrades in the history of Ethereum, and although in the long-term its impact will be felt by everyone, in the near-term some folks will need to take action to be fully prepared.

### Users and holders

> This bears repeating: As a user or holder of ETH or any other digital asset on Ethereum, as well as non-node-operating stakers, you do not need to do anything with your funds or wallet before The Merge. Despite swapping out proof-of-work, the entire history of Ethereum since genesis remains intact and unaltered after the transition to proof-of-stake. Any funds held in your wallet before The Merge will still be accessible after The Merge. No action is required to upgrade on your part.

> As we approach The Merge of Ethereum Mainnet, you should be on high alert for scams trying to take advantage of users during this transition. Do not send your ETH anywhere in an attempt to "upgrade to ETH2." There is no "ETH2" token, and there is nothing more you need to do for your funds to remain safe.

### Node operators and dapp developers

<details>
<summary> Staking node operators and providers </summary>

> If you are a staker running your own node setup or a node infrastructure provider, there are a few things you need to be aware of to be prepared for The Merge.

> Key action items include:

1. Run both a consensus layer client and an execution layer client; third-party endpoints to obtain execution data will be unavailable after The Merge.
1. Authenticate both execution layer and consensus layer clients with a shared JWT secret so they can securely communicate.
1. Set a fee recipient address to receive your earned transaction fee tips/MEV.
Not completing the first two items above items will result in your node being seen as "offline" after The Merge until both layers are synced and authenticated.

> Not setting a fee recipient will still allow your validator to behave as usual, but you will miss out on unburnt fee tips and any MEV you would have otherwise earned in blocks your validator proposes.

> For more detailed information and a summary of links to client resources, stakers are encouraged to check out the Merge Readiness Checklist over on the Staking Launchpad to make sure you're fully prepared for The Merge. Note for stakers using SaaS or staking pools: There is nothing you need to do to prepare for The Merge. More below on staying safe.

</details>

<details>
<summary> Non-validating node operators and infrastructure providers</summary>

> If you're operating a non-validating Ethereum node, the most significant change that comes with The Merge is the requirement to run clients for BOTH the execution layer AND the consensus layer.

> You probably are already running an execution layer client, such as Geth, Erigon, Besu or Nethermind. Up until The Merge, an execution layer client was enough to receive, properly validate, and propagate blocks being gossiped by the network. After The Merge, the validity of transactions contained within an execution payload will also depend on the validity of the "consensus block" it is contained within.

> As a result, a full Ethereum node after The Merge requires both an execution layer client and a consensus layer client. These two clients work together using a new Engine API. The Engine API requires authentication using a JWT secret, which is provided to both clients allowing secure communication.

>Key action items include:

1. Install a consensus layer client in addition to an execution layer client
1. Authenticate execution and consensus clients with a shared JWT secret so they can securely communicate with one another.

> Not completing the above items in time for The Merge will result in your node appearing to be "offline" until both layers are synced and authenticated.

> Node operators can also check out the Merge Readiness Checklist on the Staking Launchpad for more information, as many of the details apply to all node operators.

</details>

<details>
<summary> Dapp and smart contract developers</summary>

> The Merge has been designed to have minimal impact on smart contract and dapp developers, but there are a few small things devs may want to be aware of heading into The Merge. The Merge comes with changes to consensus, which also includes changes related to:

1. block structure
1. slot/block timing
1. opcode changes
1. sources of on-chain randomness
1. concept of safe head and finalized blocks

</details>

> This will signal the end of proof-of-work for Ethereum and start the era of a more sustainable, eco-friendly Ethereum. Learn more about Ethereum energy consumption.

> This will also set the stage for further scalability upgrades not possible under proof-of-work, bringing Ethereum one step closer to achieving the full scale, security and sustainability outlined in its Ethereum vision.

## Misconceptions about The Merge

<details> 
<summary>Running a node requires staking 32 ETH?</summary>

> False. Anyone is free to sync their own self-verified copy of Ethereum (i.e. run a node). No ETH is required. Not before The Merge, not after The Merge, not ever.

> There are two types of Ethereum nodes: nodes that can propose blocks and nodes that don't. 

> Nodes that propose blocks are only a small number of the total nodes on Ethereum. This category includes mining nodes under proof-of-work (PoW) and validator nodes under proof-of-stake (PoS). This category requires committing economic resources (such as GPU hash power in proof-of-work or staked ETH in proof-of-stake) in exchange for the ability to occasionally propose the next block and earn protocol rewards.

> The other nodes on the network (i.e. the majority) are not required to commit any economic resources beyond a consumer-grade computer with 1-2 TB of available storage and an internet connection. These nodes do not propose blocks, but they still serve a critical role in securing the network by holding all block proposers accountable by listening for new blocks and verifying their validity on arrival according to the network consensus rules. If the block is valid, the node continues propagating it through the network. If the block is invalid for whatever reason, the node software will disregard it as invalid and stop its propagation.

> Running a non-block-producing node is possible for anyone under either consensus mechanism (proof-of-work or proof-of-stake); it is strongly encouraged for all users if they have the means. Running a node is immensely valuable for Ethereum and gives added benefits to any individual running one, such as improved security, privacy and censorship resistance.

> The ability for anyone to run their own node is absolutely essential to maintaining the decentralization of the Ethereum network.

</details> 

<details>
<summary>The Merge will reduce gas fees?</summary>

> False. The Merge is a change of consensus mechanism, not an expansion of network capacity, and will not result in lower gas fees.

> Gas fees are a product of network demand relative to the capacity of the network. The Merge deprecates the use of proof-of-work, transitioning to proof-of-stake for consensus, but does not significantly change any parameters that directly influence network capacity or throughput.

> With a rollup-centric roadmap, efforts are being focused on scaling user activity at layer 2, while enabling layer 1 Mainnet as a secure decentralized settlement layer optimized for rollup data storage to help make rollup transactions exponentially cheaper. The transition to proof-of-stake is a critical precursor to realizing this. More on gas and fees.

</details>

<details>
<summary>Transactions will be noticeably faster after The Merge?</summary>

> False. Though some slight changes exist, transaction speed will mostly remain the same on layer 1.

> A transaction's "speed" can be measured in a few ways, including time to be included in a block and time to finalization. Both of these changes slightly, but not in a way that users will notice.

> Historically, on proof-of-work, the target was to have a new block every ~13.3 seconds. On the Beacon Chain, slots occur precisely every 12 seconds, each of which is an opportunity for a validator to publish a block. Most slots have blocks, but not necessarily all (i.e. a validator is offline). On proof-of-stake blocks will be produced ~10% more frequently than on proof-of-work. This is a fairly insignificant change and is unlikely to be noticed by users.

> Proof-of-stake introduces the transaction finality concept that did not previously exist. On proof-of-work, the ability to reverse a block gets exponentially more difficult with every passing block mined on top of a transaction, but it never quite reaches zero. Under proof-of-stake, blocks are bundled into epochs (6.4 minute spans of time containing 32 chances for blocks) which validators vote on. When an epoch ends, validators vote on whether to consider the epoch 'justified'. If validators agree to justify the epoch, it gets finalized in the next epoch. Undoing finalized transactions is economically unviable as it would require obtaining and burning over one-third of the total staked ETH.

> Many dapps require a number of proof-of-work block confirmations that take a period of time on par with how long proof-of-stake finality takes. Finality can offer additional security guarantees, but will not significantly speed up transactions.

</details>


<details>
<summary>You can withdraw staked ETH once The Merge occurs?</summary>

> False. Staking withdrawals are not yet enabled with The Merge. The following Shanghai upgrade will enable staking withdrawals.

> Staked ETH, staking rewards to date, and newly issued ETH immediately after The Merge will still be locked on the Beacon Chain without the ability to withdraw.

> Withdrawals are planned for the Shanghai upgrade, the next major upgrade following The Merge. This means that newly issued ETH, though accumulating on the Beacon Chain, will remain locked and illiquid for at least 6-12 months following The Merge.

</details>

<details>
<summary>Validators will not receive any liquid ETH rewards til the Shanghai upgrade when withdrawals are enabled</summary>

> False. Fee tips/MEV will be credited to a Mainnet account controlled by the validator, available immediately.

> This may seem counterintuitive to the above note that withdrawals are not enabled til the Shanghai upgrade, but validators WILL have immediate access to the fee rewards/MEV earned during block proposals.

> The protocol issues ETH as a reward to validators for contributing to consensus. This Beacon Chain accounts for the newly issued ETH, where a validator has a unique address that holds its staked ETH and protocol rewards. This ETH is locked until Shanghai.

> ETH on the execution layer (Ethereum Mainnet as we know it today) is accounted for separately from the consensus layer. When users execute transactions on Ethereum Mainnet, ETH must be paid to cover the gas, including a tip to the validator. This ETH is already on the execution layer, is NOT being newly issued by the protocol, and is available to the validator immediately (given a proper fee recipient address is provided to the client software).

</details>

<details>
<summary>When withdrawals are enabled, stakers will all exit at once?</summary>

> False. Validator exits are rate limited for security reasons.

> After the Shanghai upgrade enabled withdrawals, all validators will be incentivized to withdraw their staking balance above 32 ETH, as these funds do not add to yield and are otherwise locked. Depending on the APR (determined by total ETH staked), they may be incentivized to exit their validator(s) to reclaim their entire balance or potentially stake even more using their rewards to earn more yield.

> An important caveat here, full validator exits are rate limited by the protocol, so only six validators may exit per epoch (every 6.4 minutes, so 1350 per day, or only ~43,200 ETH per day out of over 10 million ETH staked). This rate limit adjusts depending on the total ETH staked and prevents a mass exodus of funds. Furthermore, it prevents a potential attacker from using their stake to commit a slashable offense and exiting their entire staking balance in the same epoch before the protocol can enforce the slashing penalty.

> The APR is intentionally dynamic, allowing a market of stakers to balance how much they're willing to be paid to help secure the network. When withdrawals are enabled, if the rate is too low, then validators will exit at a rate limited by the protocol. Gradually this will raise the APR for everyone who remains, attracting new or returning stakers yet again.

</details>

<details>
<summary>Staking APR is expected to triple after The Merge?</summary>

> False. More up-to-date estimations predict closer to a 50% increase in APR post-merge, not a 200% increase.

> The APR for stakers is expected to increase post-merge. To understand by how much, it is important to recognize where this increase in APR is coming from. This does not come from an increase in protocol ETH issuance (ETH issuance after The Merge is decreasing by ~90%), but is instead a reallocation of transaction fees that will start going to validators instead of miners.
This will be a new separate source of revenue for validators when they propose blocks. As you can imagine, the amount of fees a validator receives is proportional to network activity at the time of their proposed block. The more fees being paid by users, the more fees validators will receive.

> Looking at recent blockchain activity, approximately 10% of all gas fees being paid are currently going to miners in the form of a tip, while the rest is burnt. Outdated predictions estimated this percentage to be much higher, and was calculated when network usage was at all time highs. Extrapolating the 10% number to average recent network activity, it is estimated that the APR for staking will increase to ~7%, approximately 50% higher than the base issuance APR (as of June 2022).
</details>

<details>
<summary>The Merge will result in downtime of the chain?</summary>

> False. The Merge upgrade is designed to transition to proof-of-stake with zero downtime.
> An immense amount of work has been put into making sure the transition to proof-of-stake does not disrupt the network or its users.
The Merge is like changing an engine on a rocketship mid-flight and is designed to be performed without needing to pause anything during the switch. The Merge will be triggered by terminal total difficulty (TTD), which is a cumulative measure of the total mining power that has gone into building the chain. When the time comes, and this criterion is met, blocks will go from being built using proof-of-work in one block to being built by proof-of-stake in the next.

Ethereum does not have downtime.

</details>

## What happened to 'Eth2'?

> The term 'Eth2' has been deprecated as we approach The Merge. After merging 'Eth1' and 'Eth2' into a single chain, there will no longer be two distinct Ethereum networks; there will only be Ethereum.

> To limit confusion, the community has updated these terms:

1. 'Eth1' is now the 'execution layer', which handles transactions and execution.
1. 'Eth2' is now the 'consensus layer', which handles proof-of-stake consensus.

> These terminology updates only change naming conventions; this does not alter Ethereum's goals or roadmap.

## Relationship between upgrades

> The Ethereum upgrades are all somewhat interrelated. So let’s recap how The Merge relates to the other upgrades.

### The Merge and the Beacon Chain

> The Merge represents the formal adoption of the Beacon Chain as the new consensus layer to the current Mainnet execution layer. Once The Merge happens, validators will be assigned to secure Ethereum Mainnet, and mining on proof-of-work will no longer be a valid means of block production.

> Blocks will instead be proposed by validating nodes that have ether staked for the right to participate in consensus. These upgrades set the stage for future scalability upgrades, including sharding.

### The Merge and the Shanghai upgrade

> In order to simplify and maximize focus on a successful transition to proof-of-stake, The Merge upgrade will not include certain anticipated features such as the ability to withdraw staked ETH. The Shanghai upgrade is planned to follow The Merge, which will enable the ability for stakers to withdraw.

> Stay up-to-date with the Shanghai upgrade planning issue on GitHub, or the EF Research and Development Blog. For those curious, learn more about What Happens After The Merge, presented by Vitalik at the April 2021 ETHGlobal event.

### The Merge and sharding

> Originally, the plan was to work on sharding before The Merge to address scalability. However, with the boom of layer 2 scaling solutions, the priority has shifted to swapping proof-of-work to proof-of-stake via The Merge.

> Plans for sharding are rapidly evolving, but given the rise and success of layer 2 technologies to scale transaction execution, sharding plans have shifted to finding the most optimal way to distribute the burden of storing compressed calldata from rollup contracts, allowing for exponential growth in network capacity. This would not be possible without first transitioning to proof-of-stake. 

## How The Merge impacts ETH supply

> We can break the supply of ETH into two primary forces: issuance, and burn.

> The issuance of ETH is the process of creating ETH that did not previously exist. The burning of ETH is when existing ETH gets destroyed, removing it from circulation. The rate of issuance and burning gets calculated on several parameters, and the balance between them determines the resulting inflation/deflation rate of ether.

<details> 
<summary>ETH issuance tldr</summary>

1. Mining rewards ~13,000 ETH/day pre-merge
1. Staking rewards ~1,600 ETH/day pre-merge
1. After The Merge, only the ~1,600 ETH per day will remain, dropping total new ETH issuance by ~90%
1. The burn: At an average gas price of at least 16 gwei, at least 1,600 ETH is burned every day, which effectively brings net ETH inflation to zero or less post-merge.

</details> 

> How ETH gets issued will change at the time of The Merge. Currently, new ETH is issued from two sources: the execution layer (i.e. Mainnet) and the consensus layer (i.e. Beacon Chain). After The Merge, issuance from the execution layer will go to zero. Let's break this down.

## Pre-merge

### Execution layer issuance

> Under proof-of-work, miners only interact with the execution layer and are rewarded with block rewards if they are the first miner to solve the next block. Since the Constantinople upgrade in 2019 this reward has been 2 ETH per block. Miners are also rewarded for publishing ommer blocks, which are valid blocks that don't end up in the longest/canonical chain. These rewards max out at 1.75 ETH per ommer, and are in addition to the reward issued from the canonical block. Mining is an economically intensive activity, requiring high levels of ETH issuance to sustain.

### Consensus layer issuance

> The Beacon Chain went live in 2020. Instead of miners, it is secured by validators using proof-of-stake. This chain was bootstrapped by Ethereum users depositing ETH one-way into a smart contract on Mainnet, which the Beacon Chain listens to, crediting the user with an equal amount on the new chain. Until The Merge happens, the Beacon Chain's validators are not processing transactions and are essentially coming to consensus on the state of the validator pool itself.

> Validators on the Beacon Chain are rewarded with ETH for attesting to the state of the chain and proposing blocks. Rewards (or penalties) are calculated and distributed at each epoch (every 6.4 minutes) based on validator performance. The validator rewards are significantly less than the miner rewards issued on proof-of-work (2 ETH every ~13.5 seconds), as operating a validating node is not an economically intense activity and thus does not require or warrant as high a reward.

## Pre-merge issuance breakdown

> Total ETH supply: ~119,300,000 ETH (as of Q2 2022)

> Execution layer issuance:

1. Estimating at 2.08 ETH per 13.3 seconds*: ~4,930,000 ETH issued in a year
1. Currently inflating at ~4.13% (4.93M per year / 119.3M total)
1. *This includes the 2 ETH per canonical block, plus an average of 0.08 ETH over time from ommer blocks. Also uses 13.3 seconds, the baseline block time target without any influence from a difficulty bomb

> Consensus layer issuance:

1. Using 13,000,000 total ETH staked, the rate of ETH issuance is ~1600 ETH/day (See source)
1. Results in ~584,000 ETH issued in a year
1. Currently inflating at ~0.49% (584K per year / 119.3M total)

> Total annual issuance rate: ~4.62% (4.13% + 0.49%)

> ~89.4% of the issuance is going to miners on the execution layer (4.13 / 4.62 * 100)
> ~10.6% is being issued to stakers on the consensus layer (0.49 / 4.62 * 100)

## Post-merge

### Execution layer issuance

> Execution layer issuance after The Merge will be zero. Proof-of-work will no longer be valid under the rules of consensus. All execution layer activity will be included in "beacon blocks", which are published and attested to by proof-of-stake validators.

### Consensus layer issuance

> Consensus layer issuance will continue as before The Merge, with small rewards for validators who attest to and propose blocks. Validator rewards will continue to accrue to validator balances that are managed within the consensus layer. These are separate Ethereum accounts to the accounts we're used to on Mainnet, and until the Shanghai upgrade funds from validator accounts will not be withdrawable/transferrable. This means that although new ETH is still being issued, 100% of it will be locked from the market until this upgrade occurs. When the Shanghai upgrade is rolled out, this ETH will become available.

> When validator withdrawals are enabled, stakers will be incentivized to remove their earnings/rewards (balance over 32 ETH) as these funds are otherwise not contributing to their stake weight (which maxes as 32).

> Stakers may also choose to exit and withdraw their entire validator balance. To ensure Ethereum is stable, the number of validators leaving simultaneously is capped. Only six validators may exit in a given epoch (6.4 minute period) depending on the total ETH staked at the time. This decreases to as low as four as more validators withdraw to intentionally prevent large destabilizing amounts of staked ETH from leaving at once.

## Post-merge inflation breakdown

1. Total ETH supply: ~119,300,000 ETH (as of Q2 2022)
1. Execution layer issuance: 0
1. Consensus layer issuance: Same as above, ~0.49% annual issuance rate (with 13 million ETH staked)
1. Total annual issuance rate: ~0.49%

## 🔥The burn

> The opposite force to ETH issuance is the rate at which ETH is burned. For a transaction to execute on Ethereum, a minimum fee (known as a base fee) must be paid, which fluctuates continuously depending on network activity. The fee is paid in ETH and is required for the transaction to be considered valid. This fee gets burned during the transaction process, removing it from circulation.

> Fee burning went live with the London upgrade in August 2021, and will continue after the Merge.

> On top of the fee burn implemented by the London upgrade, validators can also incur penalties for being offline, or worse, they can be slashed for breaking specific rules that threaten network security. These penalties result in a reduction of ETH from that validator's balance, which is not directly rewarded to any other account, effectively burning it from circulation.



## Reference

- [The Merge](https://ethereum.org/en/upgrades/merge/#main-content)