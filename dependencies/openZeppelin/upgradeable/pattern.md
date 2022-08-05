# Learning upgrades pattern

## ERC1967 Transparent Proxy

[EIP-1967](https://eips.ethereum.org/EIPS/eip-1967) spells out standard proxy storage slots.

### Transparent

### UUPS, Universal Upgradeable Proxy Standard

> When we speak about upgradability, it means that the client always interacts with the same contract (proxy), but the underlying logic can be changed (upgraded) whenever needed without losing any previous data.

**When should we use UUPS?**

> OpenZeppelin suggests using the UUPS pattern as it is more gas efficient. But the decision of when to use UUPS is really based on several factors like the business requirements of the projects, and so on.

> The original motivation for UUPS was for deploying many smart contract wallets on the mainnet. The logic could be deployed once. The proxy could be deployed hundreds of times for each new wallet, without spending much gas.

> As the upgrade method resides in the logic contract, the developer can choose UUPS if the protocol wants to remove upgradeability completely in the future.

> initialize() : Upgradable contracts should have an initialize method in place of constructors, and also the initializer keyword makes sure that the contract is initialized only once

> \_authorizeUpgrade() : This method is required to safeguard from unauthorized upgrades because in the UUPS pattern the upgrade is done from the implementation contract, whereas in the transparent proxy pattern, the upgrade is done via the proxy contract.

> If you visit Etherscan and search the deployer address, you’ll see two new contracts created via two transactions. The first one is the actual contract (the implementation contract), and the second one is the proxy contract.

![uups-deploy-proxy-two-transactions](https://user-images.githubusercontent.com/83855174/183086758-6b72be8e-3cf7-44f0-b4ff-11cc5d389d1d.png)

## Beacon Proxy

## Reference

- [Using the UUPS proxy pattern to upgrade smart contracts](https://blog.logrocket.com/using-uups-proxy-pattern-upgrade-smart-contracts/)
