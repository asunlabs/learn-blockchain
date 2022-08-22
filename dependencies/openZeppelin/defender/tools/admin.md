# Learning Openzeppelin Admin

> The Defender Admin service acts as an interface to manage your smart contract project through secure multisig contracts or timelocks. Defender Admin holds no control at all over your system, which is fully controlled by the keys of the signers.

## Use cases

> Use Defender Admin whenever you need secure management of your smart contracts on-chain. **Any administrative operation should not be unilaterally controlled by a single owner**. Instead, set up a multi-signature wallet and rely on Defender Admin to run any of the following actions through it:

1. `Upgrading` a contract to a new implementation

1. Tweaking a `numerical parameter` in your protocol that affects its behavior

1. Managing an `access control` list for restricted operations

1. `Pausing` your contract in the event of an emergency

## Contracts and Proposals

> To begin managing one of your Contracts in Defender Admin, the first step is _to register it_. This is a one-time process where you specify network and address and assign a name to your contract. The contract’s ABI will be automatically pulled in from etherscan or sourcify if it has been verified, but you will need to manually enter it otherwise.

![image](https://user-images.githubusercontent.com/83855174/185855767-9b356f5e-468a-4c4f-9f2d-2b452549f250.png)

> Defender Admin will automatically attempt to detect some features of your contract. Today, it will detect whether it’s an `EIP1967-compatible` or a `legacy zOS proxy` (and load the implementation’s ABI in that case) and whether it’s managed by a `ProxyAdmin` contract. If you have validated your contract with Sourcify your NatSpec annotations will be available in the Admin panel.

![image](https://user-images.githubusercontent.com/83855174/185856289-5ad59312-0956-4506-aa71-1e1038fefc9d.png)

> Once the contract has been added, you can create new `Proposals` for it. Each proposal is an action you will want to execute on the contract, which is executed via `a multisig contract`, and requires a `quorum of admins` to be in agreement. Once created, other admins can review and approve the proposal until it reaches the approval threshold and is executed.

> Alternatively, you can also choose to execute an action directly on a Contract using Admin, if the function is not restricted to be called via a multisig.

> When creating a new proposal, Defender Admin will first simulate it and will refuse to create it if the action reverts, showing the revert reason returned by the contract.

> Here is a video walkthrough showing an Admin action being proposed and approved using both an EOA and a multisig:

