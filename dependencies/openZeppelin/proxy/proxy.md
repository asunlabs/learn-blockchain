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

## Core

**Proxy**

```solidity
import "@openzeppelin/contracts/proxy/Proxy.sol";
```

> This abstract contract provides a fallback function that delegates all calls to another contract using the EVM instruction delegatecall. We refer to the second contract as the implementation behind the proxy, and it has to be specified by overriding the virtual _implementation function.

> Additionally, delegation to the implementation can be triggered manually through the _fallback function, or to a different contract through the _delegate function. The success and return data of the delegated call will be returned back to the caller of the proxy.

<details>
<summary>Proxy contract APIs</summary>

> `_delegate(address implementation)`: Delegates the current call to implementation. This function does not return to its internal call site, it will return directly to the external caller.

> `_implementation() → address`: This is a virtual function that should be overridden so it returns the address to which the fallback function and _fallback should delegate.

> `_fallback()`: Delegates the current call to the address returned by _implementation(). This function does not return to its internal call site, it will return directly to the external caller.

> `fallback()`: Fallback function that delegates calls to the address returned by _implementation(). Will run if no other function in the contract matches the call data.

> `receive()`: Fallback function that delegates calls to the address returned by _implementation(). Will run if call data is empty.

> `_beforeFallback()`: Hook that is called before falling back to the implementation. Can happen as part of a manual _fallback call, or as part of the Solidity fallback or receive functions. If overridden should call super._beforeFallback().
</details>

## Utils

**Initializable**

```solidity
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
```

> This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed behind a proxy. Since proxied contracts do not make use of a constructor, it’s common to move constructor logic to an external initializer function, usually called initialize. It then becomes necessary to protect this initializer function so it can only be called once. The initializer modifier provided by this contract will have this effect.

> The initialization functions use a version number. Once a version number is used, it is consumed and cannot be reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in case an upgrade adds a module that needs to be initialized.

> For example:

```solidity
contract MyToken is ERC20Upgradeable {
    function initialize() initializer public {
        __ERC20_init("MyToken", "MTK");
    }
}
contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
    function initializeV2() reinitializer(2) public {
        __ERC20Permit_init("MyToken");
    }
}
```

> To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as possible by providing the encoded function call as the _data argument to ERC1967Proxy.constructor.

> When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.

> Avoid leaving a contract uninitialized: An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke the _disableInitializers function in the constructor to automatically lock it when it is deployed:

```solidity
/// @custom:oz-upgrades-unsafe-allow constructor
constructor() {
    _disableInitializers();
}
```

<details>
<summary>Initializable contract APIs</summary>

> `initializer()`: A modifier that defines a protected initializer function that can be invoked at most once. In its scope, onlyInitializing functions can be used to initialize parent contracts. Equivalent to reinitializer(1).

> `reinitializer(version)`:A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the contract hasn’t been initialized to a greater version before. In its scope, onlyInitializing functions can be used to initialize parent contracts.

> initializer is equivalent to reinitializer(1), so a reinitializer may be used after the original initialization step. This is essential to configure modules that are added through upgrades and that require initialization. Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in a contract, executing them in the right order is up to the developer or operator.

> `onlyInitializing()`: Modifier to protect an initialization function so that it can only be invoked by functions with the initializer and reinitializer modifiers, directly or indirectly.

> `_disableInitializers()`: A functio that locks the contract, preventing any future reinitialization. This cannot be part of an initializer call. Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized to any version. It is recommended to use this to lock implementation contracts that are designed to be called through proxies.

</details>

**UUPSUpgradeable**

```solidity
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
```

> An upgradeability mechanism designed for UUPS proxies. The functions included here can perform an upgrade of an `ERC1967Proxy`, when this contract is set as the implementation behind such a proxy.

> A security mechanism ensures that an upgrade does not turn off upgradeability accidentally, although this risk is reinstated if the upgrade retains upgradeability but removes the security mechanism, e.g. by replacing UUPSUpgradeable with a custom implementation of upgrades.

> The `_authorizeUpgrade` function must be overridden to include access restriction to the upgrade mechanism.

<details>
<summary>UUPSUpgradeable contract APIs</summary>

> `onlyProxy`: a modifier that check that the execution is being performed through a delegatecall call and that the execution context is a proxy contract with an implementation (as defined in ERC1967) pointing to self. This should only be the case for UUPS and transparent proxies that are using the current contract as their implementation. Execution of a function through ERC1167 minimal proxies (clones) would not normally pass this test, but is not guaranteed to fail.

> `notDelegated`: a modifier that Check that the execution is not being performed through a delegate call. This allows a function to be callable on the implementing contract but not through proxies.

> `proxiableableUUID`: an external function. Implementation of the ERC1822 proxiableUUID function. This returns the storage slot used by the implementation. It is used to validate that the this implementation remains valid after an upgrade. **IMPORTANT**: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this function revert if invoked through a proxy. This is guaranteed by the notDelegated modifier.

> `upgradeTo(address newImplementation)`: an external function. Upgrade the implementation of the proxy to newImplementation. Calls _authorizeUpgrade. Emits an Upgraded event.

> `upgradeToAndCall(address newImplementation, bytes data)`: an external function. Upgrade the implementation of the proxy to newImplementation, and subsequently execute the function call encoded in data. Calls _authorizeUpgrade. Emits an Upgraded event

> `_authorizeUpgrade(address newImplementation)`: an internal function. Function that should revert when msg.sender is not authorized to upgrade the contract. Called by upgradeTo and upgradeToAndCall. Normally, this function will use an access control modifier such as Ownable.onlyOwner.

```solidity
function _authorizeUpgrade(address) internal override onlyOwner {}
```

</details>