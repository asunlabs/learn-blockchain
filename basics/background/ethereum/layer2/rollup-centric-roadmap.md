# A rollup-centric ethereum roadmap by Vitalik Buterin, OCT, 2020

> Last week the Optimism team announced 572 the launch of the first stage of their testnet, and the roadmap to mainnet. They are not the only ones; Fuel 364 is moving toward a testnet and Arbitrum 280 has one. In the land of ZK rollups, Loopring 289, Zksync 283 and the Starkware-tech-based Deversifi 221 are already live and have users on mainnet. With OMG network’s mainnet beta 222, plasma is moving forward too. Meanwhile, gas prices on eth1 are climbing to new highs, to the point where some non-financial dapps are being forced to shut down 859 and others 254 are running on testnets.

> The eth2 roadmap offers scalability, and the earlier phases of eth2 are approaching quickly, but base-layer scalability for applications is only coming as the last major phase of eth2, which is still years away. In a further twist of irony, eth2’s usability as a data availability layer for rollups comes in phase 1, long before eth2 becomes usable for “traditional” layer-1 applications. These facts taken together lead to a particular conclusion: the Ethereum ecosystem is likely to be all-in on rollups (plus some plasma and channels) as a scaling strategy for the near and mid-term future.

## The Short Term: Advancing Eth1 for Rollups

> In the short term, one major outcome of this is that **Ethereum base-layer scaling would primarily be focused on scaling how much data blocks can hold, and not efficiency of on-chain computation or IO operations**. The only determinant of the scalability of a rollup is how much data the chain can hold, and any increase beyond the current ~60 kB/sec will help increase rollups’ scalability further.

> There are some things that would continue to matter at the base layer:

1. EIP 2929 416, to ensure that the chain is safe against DoS attacks at current gas levels
1. EIP 1559 308, both for the ETH burn and for the benefit of making it easy to send transactions that almost certainly get into the next block (which rollups still depend on for confirmations)
1. New elliptic curve precompiles, to fully support what people want to do with ZK rollups
1. The hex -> binary tree change and other changes to advance support for stateless clients (as stateless clients are valuable regardless of how the chain is being used)

> Account abstraction is somewhat less important, because it can be implemented on L2 regardless of whether or not L1 supports it. Other “clever base layer features” also become relatively less important.

> Eth1 clients could be repurposed as optimistic rollup clients. Optimistic rollups still need to have full nodes, and if the rollup’s internal state transition rules are essentially ethereum-like with a few modifications (as is the goal of eg. Optimism), then existing code could be repurposed to run these full nodes. The work of separating out the consensus engine from the state transition engine is already being done in the context of the eth1+eth2 merge 143, which can also help with this goal. Note in particular that this implies that projects like TurboGeth are still very important, except it would be high-throughput rollup clients, rather than base-layer eth1 clients, that would benefit the most from them.

## The Short Term: Adapting Infrastructure for Rollups

> Currently, users have accounts on L1, ENS names on L1, applications live entirely on L1, etc. All of this is going to have to change. We would need to adapt to a world where users have their primary accounts, balances, assets, etc entirely inside an L2. There are a few things that follow from this:

> ENS needs to support names being registered and transferred on L2; see here 277 for one possible proposal of how to do this.

> Layer 2 protocols should be built into the wallet, not webpage-like dapps. Currently, L2 integration into dapps/quasidapps (eg. Gitcoin’s zksync integration) requires the user to fully trust the dapp, which is a great decrease in security from the status quo. We ideally want to make L2s part of the wallet itself (metamask, status, etc) so that we can keep the current trust model. This support should be standardized, so that an application that supports zksync payments would immediately support zksync-inside-Metamask, zksync-inside-Status, etc.

> We need more work on cross-L2 transfers, making the experience of moving assets between different L2s as close to instant and seamless as possible.

> More explicitly standardize on Yul or something similar as an intermediate compiling language. Ethereum’s base-layer EVM and the OVM used in the Optimism rollup are slightly different compiling targets, but both can be compiled to from Solidity. To allow an ecosystem with different compiling targets, but at the same time avoid a Solidity monoculture and admit multiple languages, it may make sense to more explicitly standardize on something like Yul as an intermediate language that all HLLs would compile to, and which can be compiled into EVM or OVM. We could also consider a more explicitly formal-verification-friendly intermediate language that deals with concepts like variables and ensures basic invariants, making formal verification easier for any HLLs that compile to it.

## Economic Sustainability Benefits of Rollup-Centrism

> It’s an inescapable fact that a crypto project must be financially sustainable, and in 2020 this means millions or even tens of millions of dollars of funding. Some of this can be covered by common public-good-funding entities such as Gitcoin Grants or the Ethereum Foundation, but the scale of these mechanisms is just not sufficient to cover this level of funding. However, layer 2 projects launching their own token is sufficient - provided, of course, that the token is backed by genuine economic value (ie. prediction of future fees captured by the L2).

> An important secondary benefit of a rollup-centric roadmap is that it leaves open space for L2 protocols, and these L2 protocols have the ability to collect fees/MEV 162 that can fund development, either directly or indirectly (by backing a token that funds development). The Ethereum base layer has an important need to be credibly neutral, making in-protocol public goods funding difficult (imagine ACD calls trying to agree on who deserves how much money), but L2s having their own public goods funding mechanisms (and/or contributing to Gitcoin Grants) is much less contentious. Leaving open this space can thus be a good strategic move for the long-term economic sustainability of Ethereum as a whole.

> In addition to the funding issues, the most creative researchers and developers often want to be in a position of great influence on their own little island, and not in a position of little influence arguing with everyone else on the future of the Ethereum protocol as a whole. Furthermore, there are many already existing projects trying to create platforms of various kinds. A rollup-centric roadmap offers a clear opportunity for all of these projects to become part of the Ethereum ecosystem while still maintaining a high degree of local economic and technical autonomy.

## The Long Term

> In addition to these short-term concerns, a rollup-centric roadmap could also imply a re-envisioning of eth2’s long-term future: as a single high-security execution shard that everyone processes, plus a scalable data availability layer.

> To see why this is the case, consider the following:

1. Today, Ethereum has ~15 TPS.

1. If everyone moves to rollups, we will soon have ~3000 TPS.

1. Once phase 1 comes along and rollups move to eth2 sharded chains for their data storage, we go up to a theoretical max of ~100000 TPS.

1. Eventually, phase 2 will come along, bringing eth2 sharded chains with native computations, which give us… ~1000-5000 TPS.

> It seems very plausible to me that when phase 2 finally comes, essentially no one will care about it. Everyone will have already adapted to a rollup-centric world whether we like it or not, and by that point it will be easier to continue down that path than to try to bring everyone back to the base chain for no clear benefit and a 20-100x reduction in scalability.

> This implies a “phase 1.5 and done 415” approach to eth2, where the base layer retrenches and focuses on doing a few things well - namely, consensus and data availability.

> This may actually be a better position for eth2 to be in, because sharding data availability is much safer than sharding EVM computation. While dishonest-majority-proof verification of sharded EVM computation requires fraud proofs, which require a strict and potentially risky two-epoch synchrony assumption, data availability sampling (if done with ZKPs or polynomial commitments) is safe under asynchrony.

> This will help Ethereum distinguish itself as having a stronger security model than other sharded L2 chains, which are all going in the direction of having sharded execution of some form; eth2 would be the base layer that’s just powerful enough to have functionality escape velocity 251, and no more powerful.

## What could eth2 focus on in the long run?

> Staggering block times on different shards, so that at any time there will always be some shard scheduled to propose a block within a few hundred milliseconds. This allows rollups that operate across multiple shards to have ultra-low latency, without the risks of the chain itself having ultra-low latency

> Improving and solidifying its consensus algorithm

> Adjusting the EVM to be more friendly to fraud proof verifications (eg. this could imply some kind of “frame” feature that prevents code from breaking out of a sandbox or allows SLOAD/SSTORE to be remapped to using something other than account storage as their data source)

> ZK-SNARKing everything

## Compromise Proposals

> If you are not convinced to go “all the way” on the “phase 1.5 and done” direction, there is a natural compromise path to take: having a small number of execution shards (eg. 4-8) and many more data shards. The goal would be that the number of execution shards would still be low enough that in exceptional situations, regular computers would be able to fully validate all of them, but there would still be considerably more base-layer space than there is today.

> Base-layer space cannot be minimized too much, as users and applications still need it to eg. move between rollups, submit fraud proofs, submit ZK proofs in ZK rollups, publish root ERC20 token contracts (sure, most users will live in rollups, but the base contract has to live somewhere…), etc. And it would still be a large UX loss if those things cost $140 per transaction. Hence, if necessary, having 4-8 execution shards instead of 1 could provide significant relief. 

> And it would still be possible for one computer to verify all shards; today, verifying eth1 blocks on average takes ~200-500 ms every 13 seconds, so verifying eight threads of such execution for short periods of time is completely feasible. One can imagine clients have policies like “if network latency appears low or committees are >80% full, rely on fraud proofs and committees, under exceptional conditions verify all shards directly”.

