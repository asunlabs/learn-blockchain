# Openzeppelin UPgradeable FAQ

**Can I change Solidity compiler versions when upgrading?**

> Yes. The Solidity team guarantees that the compiler will preserve the storage layout across versions.

**Why am I getting the error "Cannot call fallback function from the proxy admin"?**

> This is due to the Transparent Proxy Pattern. You shouldn’t get this error when using the OpenZeppelin Upgrades Plugins, since it uses the ProxyAdmin contract for managing your proxies.

> However, if you are using OpenZeppelin Contracts proxies programmatically you could potentially run into such error. The solution is to always interact with your proxies from an account that is not the admin of the proxy, unless you want to specifically call the functions of the proxy itself.

**What does it mean for a contract to be upgrade safe?**

> When deploying a proxy for a contract, there are some limitations to the contract code. In particular, the contract cannot have a constructor, and _should not use_ the `selfdestruct` or `delegatecall` operations for security reasons.

> As a replacement for the constructor, it is common to set up an initialize function to take care of the contract’s initialization. You can use the Initializable base contract to have access to an initializer modifier that ensures the function is only called once.

```solidity
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
// Alternatively, if you are using @openzeppelin/contracts-upgradeable:
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyContract is Initializable {
  uint256 value;
  function initialize(uint256 initialValue) public initializer {
    value = initialValue;
  }
}
```

> Both plugins will validate that the contract you are trying to deploy complies with these rules. You can read more about how to write upgrade safe contracts here.

**How can I disable some of the checks?**

> Deployment and upgrade related functions come with an optional opts object, which includes an unsafeAllow option. This can be set to disable any check performed by the plugin. The list of checks that can individually be disabled is:

1. state-variable-assignment
1. state-variable-immutable
1. external-library-linking
1. struct-definition
1. enum-definition
1. constructor
1. delegatecall
1. selfdestruct
1. missing-public-upgradeto

> This function is a generalized version of the original unsafeAllowCustomTypes and unsafeAllowLinkedLibraries allowing any check to be manually disabled.

> For example, in order to upgrade to an implementation that contains a delegate call, you would call:

```ts
await upgradeProxy(proxyAddress, implementationFactory, { unsafeAllow: ['delegatecall'] });
```

> Additionally, it is possible to precisely disable checks directly from the Solidity source code using natspec comments. This requires Solidity >=0.8.2.

```solidity
contract SomeContract {
  function some_dangerous_function() public {
    ...
    /// @custom:oz-upgrades-unsafe-allow delegatecall
    (bool success, bytes memory returndata) = msg.sender.delegatecall("");
    ...
  }
}
```

> This syntax can be used with the following errors:

```
/// @custom:oz-upgrades-unsafe-allow state-variable-immutable

/// @custom:oz-upgrades-unsafe-allow state-variable-assignment

/// @custom:oz-upgrades-unsafe-allow external-library-linking

/// @custom:oz-upgrades-unsafe-allow constructor

/// @custom:oz-upgrades-unsafe-allow delegatecall

/// @custom:oz-upgrades-unsafe-allow selfdestruct
```

> In some cases you may want to allow multiple errors in a single line.

```solidity
contract SomeOtherContract {
  /// @custom:oz-upgrades-unsafe-allow state-variable-immutable state-variable-assignment
  uint256 immutable x = 1;
}
```

**Can I safely use delegatecall and selfdestruct?**

> This is an advanced technique and can put funds at risk of permanent loss.

> It may be possible to safely use delegatecall and selfdestruct if they are guarded so that they can only be triggered through proxies and not on the implementation contract itself. A way to achieve this in Solidity is as follows.

```solidity
abstract contract OnlyDelegateCall {
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable state-variable-assignment
    address private immutable self = address(this);

    function checkDelegateCall() private view {
        require(address(this) != self);
    }

    modifier onlyDelegateCall() {
        checkDelegateCall();
        _;
    }
}
```

```solidity
contract UsesUnsafeOperations is OnlyDelegateCall {
    /// @custom:oz-upgrades-unsafe-allow selfdestruct
    function destroyProxy() onlyDelegateCall {
        selfdestruct(msg.sender);
    }
}
```

**What does it mean for an implementation to be compatible?**

> When upgrading a proxy from one implementation to another, the storage layout of both implementations must be compatible. This means that, even though you can completely change the code of the implementation, you cannot modify the existing contract state variables. _The only operation allowed is to append new state variables after the ones already declared_.

> Both _plugins will validate that the new implementation contract is compatible_ with the previous one. You can read more about how to make storage-compatible changes to an implementation contract here.

**What is a proxy admin?**

> A _ProxyAdmin_ is a contract that acts as _the owner of all your proxies_. Only one per network gets deployed. When you start your project, _the ProxyAdmin is owned by the deployer address_, but you can transfer ownership of it by calling transferOwnership.

**What is an implementation contract?**

> Upgradeable deployments require at least two contracts: a proxy and an implementation. The _proxy contract_ is the instance you and _your users will interact with_, and the _implementation_ is the contract _that holds the code_. If you call deployProxy several times for the same implementation contract, several proxies will be deployed, but only one implementation contract will be used.

> When you upgrade a proxy to a new version, a new implementation contract is deployed if needed, and the proxy is set to use the new implementation contract. You can read more about the proxy upgrade pattern here.

**What is a proxy?**

> A proxy is a contract that delegates all of its calls to a second contract, named an implementation contract. _All state and funds are held in the proxy_, but the code actually executed is that of the implementation. A proxy can be _upgraded by its admin_ to use a different implementation contract.

**Why can’t I use immutable variables?**

> Solidity 0.6.5 introduced the `immutable` keyword to declare a variable that can be _assigned only once during construction_ and can be read only after construction. It does so by _calculating its value during contract creation_ and _storing its value directly into the bytecode_.

> Notice that this behavior is incompatible with the way upgradeable contracts work for two reasons:

1. Upgradeable contracts have no constructors but initializers, therefore they can’t handle immutable variables.

1. Since the immutable variable value is stored in the bytecode its value would be shared among all proxies pointing to a given contract instead of each proxy’s storage.

> In some cases immutable variables are upgrade safe. The plugins cannot currently detect these cases automatically so they will point it out as an error anyway. You can manually disable the check using the option unsafeAllow: ['state-variable-immutable'], or in Solidity >=0.8.2 placing the comment /// @custom:oz-upgrades-unsafe-allow state-variable-immutable before the variable declaration.

**Why can’t I use external libraries?**

> At the moment the plugins only have partial support for upgradeable contracts linked to external libraries. This is because it’s not known at compile time what implementation is going to be linked thus making it very difficult to guarantee the safety of the upgrade operation.

> There are plans to add this functionality in the near future with certain constraints that make the issue easier to address like assuming that the external library’s source code is either present in the codebase or that it’s been deployed and mined so it can be fetched from the blockchain for analysis.

> In the meantime you can deploy upgradeable contracts linked to external libraries by setting the `unsafeAllowLinkedLibraries` flag to true in the `deployProxy` or `upgradeProxy` calls, or including `'external-library-linking'` in the unsafeAllow array. Keep in mind the plugins will not verify that the linked libraries are upgrade safe. This has to be done manually for now until the full support for external libraries is implemented.

**Why do I need a public upgradeTo function?**

> When using UUPS proxies (through the kind: 'uups' option), the implementation contract must include the public function `upgradeTo(address newImplementation)`. This is because in the UUPS pattern the proxy does not contain an upgrading function itself, and _the entire upgradeability mechanism lives on the implementation side_. Thus, on every deploy and upgrade we have to make sure to include it, otherwise we may permanently disable the upgradeability of the contract.

> The recommended way to include this function is by inheriting the _UUPSUpgradeable contract_ provided in OpenZeppelin Contracts, as shown below. This contract adds the required `upgradeTo` function, but also contains a built-in mechanism that will check on-chain, at the time of an upgrade, that the new implementation proposed preserves upgradeTo. In this way, when _using the Upgrades Plugins there is a double layer of protection_ so that upgradeability is not accidentally disabled: _off-chain by the plugins, and on-chain by the contract itself_.

```solidity
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyContract is Initializable, ..., UUPSUpgradeable {
    ...
}
```

**Can I use custom types like structs and enums?**

> Past versions of the plugins did not support upgradeable contracts that used custom types like structs or enums in their code or linked libraries. This is no longer the case for current versions of the plugins, and _structs and enums will be automatically checked for compatibility when upgrading a contract_.

> Some users who have already deployed proxies with structs and/or enums and who need to upgrade those proxies may need to use the override flag unsafeAllowCustomTypes for their next upgrade, after which it will no longer be necessary. If the project contains the source code for the implementation currently in use by the proxy, the plugin will attempt to recover the metadata that it needs before the upgrade, falling back to the override flag if this is not possible.

**Why do I have to recompile all contracts for Truffle?**

> Truffle artifacts (the JSON files in build/contracts) contain the AST (abstract syntax tree) for each of your contracts. Our plugin uses this information to validate that your contracts are [upgrade safe](#what-does-it-mean-for-a-contract-to-be-upgrade-safe).

> Truffle sometimes partially recompiles only the contracts that have changed. We will ask you to trigger a full recompilation either using truffle compile --all or deleting the build/contracts directory when this happens. The technical reason is that since Solidity does not produce deterministic ASTs, _the plugins are unable to resolve references correctly if they are not from the same compiler run_.

**How can I rename a variable, or change its type?**

> Renaming a variable is disallowed by default because there is a change that a renaming is actually an accidental reordering. For example if variables uint a; uint b; are upgraded to uint b; uint a;, if renaming was simply allowed this would not be seen as a mistake, but it could have been an accident, specially when multiple inheritance is involved.

> It is possible to disable this check by passing the option `unsafeAllowRenames: true`. A more granular approach is to use a docstring comment `/// @custom:oz-renamed-from <previous name>` right above the variable that is being renamed, for example:

```solidity
contract V1 {
    uint x;
}
contract V2 {
    /// @custom:oz-renamed-from x
    uint y;
}
```

> _Changing the type of a variable is not allowed either_, even in cases where the types have the same size and alignment, for the similar reason explained above. As long as we can guarantee that the rest of the layout is not affected by this type change, it is also possible to _override this check by placing a docstring comment /// @custom:oz-retyped-from <previous type>_.

```solidity
contract V1 {
    bool x;
}
contract V2 {
    /// @custom:oz-retyped-from bool
    uint8 x;
}
```

> Docstring comments don’t yet work for struct members, due to a current Solidity limitation.

## Reference

- [OZ - Frequently Asked Questions](https://docs.openzeppelin.com/upgrades-plugins/1.x/faq)