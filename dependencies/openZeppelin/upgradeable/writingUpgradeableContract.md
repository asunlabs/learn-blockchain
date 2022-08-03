### Writing upgradable smart contract

> If your contract is going to be deployed with upgradeability, such as using the OpenZeppelin Upgrades Plugins, you will need to use the Upgradeable variant of OpenZeppelin Contracts. This variant is available as a separate package called @openzeppelin/contracts-upgradeable, which is hosted in the repository OpenZeppelin/openzeppelin-contracts-upgradeable.

> It follows all of the rules for Writing Upgradeable Contracts:

1. constructors are replaced by initializer functions
1. state variables are initialized in initializer functions

> and we additionally check for storage incompatibilities across minor versions.

Install it like below.

```shell
$npm install @openzeppelin/contracts-upgradeable
```

> The package replicates the structure of the main OpenZeppelin Contracts package, but every file and contract has the suffix Upgradeable.

```
-import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
+import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

-contract MyCollectible is ERC721 {
+contract MyCollectible is ERC721Upgradeable {
```

> **Constructors are replaced by internal initializer functions** following the naming convention \_\_{ContractName}\_init. Since these are internal, you must always define your own public initializer function and call the parent initializer of the contract you extend.

```
-    constructor() ERC721("MyCollectible", "MCO") public {
+    function initialize() initializer public {
+        __ERC721_init("MyCollectible", "MCO");
    }
```

> When working with upgradeable contracts using OpenZeppelin Upgrades, there are a few minor caveats to keep in mind when writing your Solidity code. It’s worth mentioning that **these restrictions have their roots in how the Ethereum VM works**, and _apply to all projects_ that work with upgradeable contracts, not just OpenZeppelin Upgrades.

#### Initializer

> You can use your Solidity contracts with OpenZeppelin Upgrades without any modifications, except for their constructors. Due to a requirement of the proxy-based upgradeability system, **no constructors can be used in upgradeable contracts**. This means that, when using a contract with the OpenZeppelin Upgrades, you **need to change its constructor into a regular function**, typically named initialize, where you run all the setup logic:

```solidity
pragma solidity ^0.6.0;

contract MyContract {
    uint256 public x;
    // To prevent a contract from being initialized multiple times, you need to add a check to ensure the initialize function is called only once
    bool private initialized;

    function initialize(uint256 _x) public {
        require(!initialized, "Contract instance has already been initialized");
        initialized = true;
        x = _x;
    }
}
```

> Since this pattern is very common when writing upgradeable contracts, OpenZeppelin Contracts provides an Initializable base contract that has an initializer modifier that takes care of this:

```solidity
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyContract is Initializable {
    uint256 public x;

    function initialize(uint256 _x) public initializer {
        x = _x;
    }
}
```

> Another difference between a constructor and a regular function is that Solidity takes care of automatically invoking the constructors of all ancestors of a contract. **When writing an initializer, you need to take special care to manually call the initializers of all parent contracts**:

```solidity
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BaseContract is Initializable {
    uint256 public y;

    function initialize() public initializer {
        y = 42;
    }
}

contract MyContract is BaseContract {
    uint256 public x;

    function initialize(uint256 _x) public initializer {
        BaseContract.initialize(); // Do not forget this call!
        x = _x;
    }
}
```

#### Using Upgradeable Smart Contract Libraries

> Note that you should not be using these contracts, for example ERC20.sol, ERC721.sol, in your OpenZeppelin Upgrades project. Instead, make sure to use @openzeppelin/contracts-upgradeable, which is an official fork of OpenZeppelin Contracts that has been modified to use initializers instead of constructors. Whether using OpenZeppelin Contracts or another smart contract library, always make sure that the package is set up to handle upgradeable contracts.

#### Avoiding Initial Values in Field Declarations

> Whilst Solidity allows defining initial values for fields when declaring them in a contract, this will not work for upgradeable contracts.

```solidity
// bad
contract MyContract {
    uint256 public hasInitialValue = 42; // equivalent to setting in the constructor
}

// good
contract MyContract is Initialiaable {
    uint256 public hasInitialValue; // do not initialize state variables here.
    uint256 public constant hasConstantInitialValue = 33; // but constant is good to go.

    function initialize() public initializer {
        hasInitialValue = 42; // set initial value in initializer
    }
}
```

> It is **still ok to define constant** state variables, because **the compiler does not reserve a storage slot** for these variables, and every occurrence is replaced by the respective constant expression.

#### Initializing the Implementation Contract

> Do not leave an implementation contract uninitialized. An uninitialized implementation contract can be taken over by an attacker, which may impact the proxy. **You can either invoke the initializer manually, or you can include a constructor to automatically mark it as initialized when it is deployed**:

```solidity
/// @custom:oz-upgrades-unsafe-allow constructor
constructor() {
    _disableInitializers();
}
```

#### No selfdestruct and delegatecall

> As such, it is not allowed to use either selfdestruct or delegatecall in your upgradable contracts. When working with upgradeable smart contracts, you will always interact with the contract instance, and never with the underlying logic contract. However, **nothing prevents a malicious actor from sending transactions to the logic contract directly**. This does not pose a threat, since any changes to the state of the logic contracts do not affect your contract instances, as **the storage of the logic contracts is never used in your project**.

> There is, however, an exception. **If the direct call to the logic contract triggers a selfdestruct** operation, then the logic contract will be destroyed, and all your contract instances will end up delegating all calls to an address without any code. **This would effectively break all contract instances in your project**.

> A similar effect can be achieved if the logic contract **contains a delegatecall operation**. If the contract can be made to delegatecall into a malicious contract that contains a selfdestruct, then the **calling contract will be destroyed**.

#### Modifying contract, keeping storage layout

> When writing new versions of your contracts, either due to new features or bug fixing, there is an additional restriction to observe: you **cannot change the order** in which the contract state variables are declared, **nor their type**. Violating any of these storage layout restrictions will cause the upgraded version of the contract to have its storage values mixed up, and can lead to critical errors in your application.

For example,

```solidity
// initial contract
contract MyContract {
    uint256 private x;
    string private y;
}

// bad : cannot change variable type
contract MyContract {
    string private x;
    string private y;
}

// bad : cannot change variable order
contract MyContract {
    string private y;
    uint256 private x;
}

// bad : cannot introduce a new variable before existing one
contract MyContract {
    bytes private a;
    uint256 private x;
    string private y;
}

// good : can add a new variable at the end
contract MyContract {
    uint256 private x; // existing one
    string private y; // existing one
    bytes private z; // new variable z
}

// bad : cannot remove an existing variable
contract MyContract {
    string private y;
}
```

> Keep in mind that if you rename a variable, then it will keep the same value as before after upgrading. This may be the desired behavior if the new variable is semantically the same as the old one:

```solidity
contract MyContract {
    uint256 private x;
    string private z; // starts with the value from `y`, only name changed
}
```

> And if you remove a variable from the end of the contract, note that the storage will not be cleared. A subsequent update that adds a new variable will cause that variable to read the leftover value from the deleted one.

```solidity
contract MyContract {
    uint256 private x;
    // storage for y is not cleared even though it is deleted.
}

// thus upgraded to
contract MyContract {
    uint256 private x;
    string private z; // starts with the value from `y`
}
```

> Note that you may also be inadvertently changing the storage variables of your contract by changing its parent contracts. Then modifying MyContract by swapping the order in which the base contracts are declared, or introducing new base contracts, will change how the variables are actually stored:

```solidity
// good
contract A {
    uint256 a;
}

contract B {
    uint256 b;
}

contract MyContract is A, B {}

// bad
contract MyContract is B, A {}

```

> You also cannot add new variables to base contracts, if the child has any variables of its own. Given the following scenario:

```solidity
contract Base {
    uint256 base1;
}

contract Child is Base {
    uint256 child;
}
```

> If Base is modified to add an extra variable:

```solidity
contract Base {
    uint256 base1;
    uint256 base2;
}
```

> Then the variable base2 would be assigned the slot that child had in the previous version. A workaround for this is to declare unused variables on base contracts that you may want to extend in the future, as a means of "reserving" those slots. Note that this trick does not involve increased gas usage.
