# Proxies

> This is a low-level set of contracts implementing **different proxy patterns with and without upgradeability**. For an in-depth overview of this pattern check out the Proxy Upgrade Pattern page.

> Most of the proxies below are built on an abstract base contract.

- Proxy: Abstract contract implementing the core delegation functionality.

> In order to avoid clashes with the storage variables of the implementation contract behind a proxy, we use EIP1967 storage slots.

```md
**EIP-1967: Standard Proxy Storage Slots**

> Delegating proxy contracts are widely used for both upgradeability and gas savings. These proxies rely on a logic contract (also known as implementation contract or master copy) that is called using delegatecall. This allows proxies to keep a persistent state (storage and balance) while the code is delegated to the logic contract.

> To avoid clashes in storage usage between the proxy and logic contract, the address of the logic contract is typically saved in a specific storage slot (for example 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc in OpenZeppelin contracts) guaranteed to be never allocated by a compiler. This EIP proposes a set of standard slots to store proxy information. This allows clients like block explorers to properly extract and show this information to end users, and logic contracts to optionally act upon it.

> This ERC relies on the fact that the chosen storage slots are not to be allocated by the solidity compiler. This guarantees that an implementation contract will not accidentally overwrite any of the information required for the proxy to operate. As such, locations with a high slot number were chosen to avoid clashes with the slots allocated by the compiler. Also, locations with no known preimage were picked, to ensure that a write to mapping with a maliciously crafted key could not overwrite it.

> Logic contracts that intend to modify proxy-specific information must do so deliberately (as is the case with UUPS) by writing to the specific storage slot.

```

> There are two alternative ways to add upgradeability to an ERC1967 proxy. Their differences are explained below in Transparent vs UUPS Proxies.

- TransparentUpgradeableProxy: A proxy with a built in admin and upgrade interface.
- UUPSUpgradeable: An upgradeability mechanism to be included in the implementation contract.

> Using upgradeable proxies correctly and securely is a difficult task that requires deep knowledge of the proxy pattern, Solidity, and the EVM. Unless you want a lot of low level control, we recommend using the OpenZeppelin Upgrades Plugins for Truffle and Hardhat.

> A different family of proxies are **beacon proxies**. This pattern, popularized by Dharma, allows **multiple proxies** to be **upgraded** to a different implementation **in a single transaction**.

- BeaconProxy: A proxy that retrieves its implementation from a beacon contract.
- UpgradeableBeacon: A beacon contract with a built in admin that can upgrade the BeaconProxy pointing to it.

> In this pattern, the proxy contract doesn’t hold the **implementation address** in storage like an ERC1967 proxy, instead the address is **stored in a separate beacon contract**. The upgrade operations that are sent to the beacon instead of to the proxy contract, and all proxies that follow that beacon are automatically upgraded.

> Outside the realm of upgradeability, **proxies can also be useful to make cheap contract clones**, such as those created by an on-chain factory contract that creates many instances of the same contract. These instances are designed to be both **cheap to deploy, and cheap to call**.

- Clones: A library that can deploy cheap minimal non-upgradeable proxies. Available since Openzeppelin v3.4. Based on ERC1167.

## Transparent vs UUPS Proxies

> The **original proxies** included in OpenZeppelin followed the **Transparent Proxy Pattern**. While this pattern is still provided, our recommendation is now shifting towards UUPS proxies, which are both lightweight and versatile. **The name UUPS comes from EIP1822**, which first documented the pattern.

> While both of these share the same interface for upgrades, in UUPS proxies the upgrade is handled by the implementation, and can eventually be removed. Transparent proxies, on the other hand, include the upgrade and admin logic in the proxy itself. This means TransparentUpgradeableProxy is more expensive to deploy than what is possible with UUPS proxies.

- Transparent proxy: **upgrade + admin** => relatively more expensive 
- UUPS proxy: **admin** => relatively cheaper. proxy itself is not upgradeable

> **UUPS proxies** are implemented using an **ERC1967Proxy**. Note that this proxy is not by itself upgradeable. **It is the role of the implementation** to include, alongside the contract’s logic, all the code necessary **to update the implementation’s address that is stored at a specific slot** in the proxy’s storage space. This is where the UUPSUpgradeable contract comes in. Inheriting from it (and **overriding the _authorizeUpgrade function with the relevant access control** mechanism) will turn your contract into a UUPS compliant implementation.

> Note that since both proxies use the same storage slot for the implementation address, **using a UUPS compliant implementation with a TransparentUpgradeableProxy might allow non-admins to perform upgrade operations**.

> By default, the upgrade functionality included in UUPSUpgradeable contains a security mechanism that will **prevent any upgrades to a non UUPS compliant implementation**. This prevents upgrades to an implementation contract that wouldn’t contain the necessary upgrade mechanism, as it would lock the upgradeability of the proxy forever. This security mechanism can be bypassed by either of:

- Adding a flag mechanism in the implementation that will disable the upgrade function when triggered.

- Upgrading to an implementation that features an upgrade mechanism without the additional security check, and then upgrading again to another implementation without the upgrade mechanism.

> **The current implementation of this security mechanism uses EIP1822** to detect the storage slot used by the implementation. A previous implementation, now deprecated, relied on a rollback check. It is possible to upgrade from a contract using the old mechanism to a new one. The inverse is however not possible, as old implementations (before version 4.5) did not include the ERC1822 interface.

> 