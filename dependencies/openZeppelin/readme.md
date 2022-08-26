# Learning OpenZeppelin essentials

## Access control

> Access control—that is, "who is allowed to do this thing"—is incredibly important in the world of smart contracts. The access control of your contract may govern who can mint tokens, vote on proposals, freeze transfers, and many other things. It is therefore critical to understand how you implement it, lest someone else steals your whole system.

### Ownership

> The most common and basic form of access control is the concept of ownership: there’s an account that is the owner of a contract and can do administrative tasks on it. This approach is perfectly reasonable for contracts that have a single administrative user.

```solidity
// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    function normalThing() public {
        // anyone can call this normalThing()
    }

    function specialThing() public onlyOwner {
        // only the owner can call specialThing()!
    }
}
```

> By default, the owner of an Ownable contract is the account that deployed it, which is usually exactly what you want.

### Multi-signature

> Note that a contract can also be the owner of another one! This opens the door to using, for example, a Gnosis Multisig or Gnosis Safe, an Aragon DAO, an ERC725/uPort identity contract, or a totally custom contract that you create.

> In this way you can use composability to add additional layers of access control complexity to your contracts. Instead of having a single regular Ethereum account (Externally Owned Account, or EOA) as the owner, you could use a 2-of-3 multisig run by your project leads, for example. Prominent projects in the space, such as MakerDAO, use systems similar to this one.

### Role-based access control

> While the simplicity of ownership can be useful for simple systems or quick prototyping, different levels of authorization are often needed. You may want for an account to have permission to ban users from a system, but not create new tokens. Role-Based Access Control (RBAC) offers flexibility in this regard.

> In essence, we will be defining multiple roles, each allowed to perform different sets of actions. An account may have, for example, 'moderator', 'minter' or 'admin' roles, which you will then check for instead of simply using onlyOwner. This check can be enforced through the onlyRole modifier. Separately, you will be able to define rules for how accounts can be granted a role, have it revoked, and more.

> Most software uses access control systems that are role-based: some users are regular users, some may be supervisors or managers, and a few will often have administrative privileges.

> OpenZeppelin Contracts provides AccessControl for implementing role-based access control. Its usage is straightforward: for each role that you want to define, you will create a new role identifier that is used to grant, revoke, and check if an account has that role.

> where AccessControl shines is in scenarios where granular permissions are required, which can be implemented by defining multiple roles.

```solidity
// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(address minter, address burner) ERC20("MyToken", "TKN") {
        _setupRole(MINTER_ROLE, minter);
        _setupRole(BURNER_ROLE, burner);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }
}
```

#### Granting and revoking roles

```solidity
// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(address minter, address burner) ERC20("MyToken", "TKN") {
        // Grant the contract deployer the default admin role: it will be able to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }
}
```

> Note that, unlike the previous examples, no accounts are granted the 'minter' or 'burner' roles. However, because those roles' admin role is the default admin role, and that role was granted to msg.sender, that same account can call grantRole to give minting or burning permission, and revokeRole to remove it.

> Dynamic role allocation is often a desirable property, for example in systems where trust in a participant may vary over time. It can also be used to support use cases such as KYC, where the list of role-bearers may not be known up-front, or may be prohibitively expensive to include in a single transaction.

## Upgradable smart contract

> Smart contracts in Ethereum are immutable by default. Once you create them there is no way to alter them, effectively acting as an unbreakable contract among participants.

> However, for some scenarios, it is desirable to be able to modify them. Think of a traditional contract between two parties: if they both agreed to change it, they would be able to do so. On Ethereum, they may desire to alter a smart contract to fix a bug they found (which might even lead to a hacker stealing their funds!), to add additional features, or simply to change the rules enforced by it.

> OpenZeppelin provides tooling for deploying and securing upgradeable smart contracts.

1. Upgradeable Contracts to build your contract using our Solidity components.
1. Upgrades Plugins to deploy upgradeable contracts with automated security checks.
1. Defender Admin to manage upgrades in production and automate operations.

<details>
<summary>What is a Proxy contract?</summary>

> A proxy is a contract that delegates all of its calls to a second contract, named an implementation contract. **All state and funds are held in the proxy**, but the code actually executed is that of the implementation. A proxy can be upgraded by its admin to use a different implementation contract.

</details>

<details>
<summary>What is an implementation contract?</summary>

> Upgradeable deployments require at least two contracts: a proxy and an implementation. The proxy contract is the instance you and your users will interact with, and **the implementation is the contract that holds the code**. If you call deployProxy several times for the same implementation contract, several proxies will be deployed, but **only one implementation contract will be used**.

When you upgrade a proxy to a new version, **a new implementation contract is deployed if needed**, and the proxy is set to use the new implementation contract.

</details>

#### Proxy upgrade pattern

##### Upgrading via Proxy pattern

> The basic idea is using a proxy for upgrades. **The first contract is a simple wrapper or "proxy"** which users interact with directly and is **in charge of forwarding transactions to and from the second contract**, which contains the logic. The key concept to understand is that the **logic contract can be replaced** while the **proxy, or the access point is never changed**. Both contracts are still immutable in the sense that their code cannot be changed, but the logic contract can simply be swapped by another contract. The wrapper can thus point to a different logic implementation and in doing so, the software is "upgraded".

<img src="https://user-images.githubusercontent.com/83855174/158337176-fe281f21-27ac-443d-8438-2352a706b800.png" />

##### Proxy forwarding

> The most immediate problem that proxies need to solve is how the proxy exposes the entire interface of the logic contract without requiring a one to one mapping of the entire logic contract’s interface. That would be difficult to maintain, prone to errors, and would make the interface itself not upgradeable. Hence, a dynamic forwarding mechanism is required. The basics of such a mechanism are presented in the code below:

```assembly
assembly {
  let ptr := mload(0x40)

  // (1) copy incoming call data
  calldatacopy(ptr, 0, calldatasize)

  // (2) forward call to logic contract
  let result := delegatecall(gas, _impl, ptr, calldatasize, 0, 0)
  let size := returndatasize

  // (3) retrieve return data
  returndatacopy(ptr, 0, size)

  // (4) forward return data back to caller
  switch result
  case 0 { revert(ptr, size) }
  default { return(ptr, size) }
}
```

> This code can be put in the [fallback function](https://solidity.readthedocs.io/en/v0.6.12/contracts.html#fallback-function) of a proxy, and will forward any call to any function with any set of parameters to the logic contract without it needing to know anything in particular of the logic contract’s interface.

> In essence, (1) the calldata is copied to memory, (2) the call is forwarded to the logic contract, (3) the return data from the call to the logic contract is retrieved, and (4) the returned data is forwarded back to the caller.

> A very important thing to note is that the code makes use of **the EVM’s delegatecall opcode which executes the callee’s code in the context of the caller’s state**.

> **That is, the logic contract controls the proxy’s state and the logic contract’s state is meaningless**. Thus, the proxy doesn’t only forward transactions to and from the logic contract, but also represents the pair’s state. **The state is in the proxy** and the logic is in the particular implementation that the proxy points to.

##### Unstructured Storage Proxies : storage collision

> A problem that quickly comes up when using proxies has to do with the way in which variables are stored in the proxy contract. Suppose that the proxy stores the logic contract’s address in its only variable address public \_implementation;. Now, suppose that the logic contract is a basic token whose first variable is address public \_owner. Both variables are 32 byte in size, and as far as the EVM knows, occupy the first slot of the resulting execution flow of a proxied call. When the logic contract writes to \_owner, it does so in the scope of the proxy’s state, and in reality writes to \_implementation. This problem can be referred to as a "storage collision".

<img src="proxy-storage-collision.png" width=800 height=200 alt="proxy and logic contract's storage collision"/>

> There are many ways to overcome this problem, and the "unstructured storage" approach which OpenZeppelin Upgrades implements works as follows. Instead of storing the \_implementation address at the proxy’s first storage slot, it chooses a pseudo random slot instead. This slot is sufficiently random, that the probability of a logic contract declaring a variable at the same slot is negligible. The same principle of randomizing slot positions in the proxy’s storage is used in any other variables the proxy may have, such as an admin address (that is allowed to update the value of \_implementation), etc.

<img src="proxy-random-slot.png" width=800 height=200 alt="proxy and logic contract's storage collision"/>

> An example of how the randomized storage is achieved, following EIP 1967:

```solidity
bytes32 private constant implementationPosition = bytes32(uint256(
  keccak256('eip1967.proxy.implementation')) - 1
));
```

> As a result, a logic contract doesn’t need to care about overwriting any of the proxy’s variables. Other proxy implementations that face this problem usually imply having the proxy know about the logic contract’s storage structure and adapt to it, or instead having the logic contract know about the proxy’s storage structure and adapt to it. This is why this approach is called "unstructured storage"; neither of the contracts needs to care about the structure of the other.

##### Storage Collisions Between Implementation Versions

> As discussed, the unstructured approach avoids storage collisions between the logic contract and the proxy. However, storage collisions between different versions of the logic contract can occur. In this case, imagine that the first implementation of the logic contract stores address public \_owner at the first storage slot and an upgraded logic contract stores address public \_lastContributor at the same first slot.

> When the updated logic contract attempts to write to the \_lastContributor variable, it will be using the same storage position where the previous value for \_owner was being stored, and overwrite it!

<img src="logic-contracts-storage-extension.png" width=850 height=480 alt="storage extension for logic contract"/>

> The unstructured storage proxy mechanism doesn’t safeguard against this situation. It is up to the user to have new versions of a logic contract extend previous versions, or otherwise guarantee that the storage hierarchy is always appended to but not modified. However, OpenZeppelin Upgrades detects such collisions and warns the developer appropriately.

##### The Constructor Caveat

> In Solidity, code that is inside a constructor or part of a global variable declaration is not part of a deployed contract’s runtime bytecode. This code is executed only once, when the contract instance is deployed. As a consequence of this, the code within a logic contract’s constructor will never be executed in the context of the proxy’s state. To rephrase, proxies are completely oblivious to the existence of constructors. It’s simply as if they weren’t there for the proxy.

> The problem is easily solved though. Logic contracts should move the code within the constructor to a regular 'initializer' function, and have this function be called whenever the proxy links to this logic contract. Special care needs to be taken with this initializer function so that it can only be called once, which is one of the properties of constructors in general programming.

> This is why when we create a proxy using OpenZeppelin Upgrades, you can provide the name of the initializer function and pass parameters.

> To ensure that the initialize function can only be called once, a simple modifier is used. OpenZeppelin Upgrades provides this functionality via a contract that can be extended:

```solidity
// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// Notice how the contract extends Initializable and implements the initializer provided by it.
contract MyContract is Initializable {
    function initialize(
        address arg1,
        uint256 arg2,
        bytes memory arg3
    ) public payable initializer {
        // "constructor" code...
    }
}
```

##### Transparent Proxies and Function Clashes

> As described in the previous sections, upgradeable contract instances (or proxies) work by delegating all calls to a logic contract. However, the proxies need some functions of their own, such as upgradeTo(address) to upgrade to a new implementation. This begs the question of how to proceed if the logic contract also has a function named upgradeTo(address): upon a call to that function, did the caller intend to call the proxy or the logic contract?

> The way OpenZeppelin Upgrades deals with this problem is via the transparent proxy pattern. A transparent proxy will decide which calls are delegated to the underlying logic contract based on the caller address (i.e., the msg.sender):

1. If the caller is the admin of the proxy (the address with rights to upgrade the proxy), then the proxy will not delegate any calls, and only answer any messages it understands.

1. If the caller is any other address, the proxy will always delegate a call, no matter if it matches one of the proxy’s functions.

> Assuming a proxy with an owner() and an upgradeTo() function, that delegates calls to an ERC20 contract with an owner() and a transfer() function, the following table covers all scenarios:

<img src="transparent-proxy-pattern-caller-address.png" width=744 height=205 alt="transparent proxy pattern"/>

> Fortunately, OpenZeppelin Upgrades accounts for this situation, and creates an intermediary ProxyAdmin contract that is in charge of all the proxies you create via the Upgrades plugins. Even if you call the deploy command from your node’s default account, the ProxyAdmin contract will be the actual admin of all your proxies.

> This means that you will be able to interact with the proxies from any of your node’s accounts, without having to worry about the nuances of the transparent proxy pattern. Only advanced users that create proxies from Solidity need to be aware of the transparent proxies pattern.

> It all comes down to the following list:

1. Have a basic understanding of wht a proxy is
1. Always extend storage instead of modifying it
1. Make sure your contracts use initializer functions instead of constructors

### Network file

> OpenZeppelin Upgrades keep track of all the contract versions you have deployed in an .openzeppelin folder in the project root, as well as the proxy admin. You will find one file per network there. It is advised that you commit to source control the files for all networks except the development ones (you may see them as .openzeppelin/unknown-\*.json)

#### Network Files

> OpenZeppelin Upgrades will generate a file for each of the networks you work on (ropsten, mainnet, etc). These files share the same structure:

```json
// .openzeppelin/<network_name>.json
{
  "manifestVersion": "3.0",
  "impls": {
    "...": {
      "address": "...",
      "txHash": "...",
      "layout": {
        "storage": [...],
        "types": {...}
      }
    },
    "...": {
      "address": "...",
      "txHash": "...",
      "layout": {
        "storage": [...],
        "types": {...}
      }
    }
  },
  "admin": {
    "address": "...",
    "txHash": "..."
  }
}
```

> For every logic contract, besides the deployment address, the following info is also tracked:

1. types keeps track of all the types used in the contract or its ancestors, from basic types like uint256 to custom struct types

1. storage tracks the storage layout of the linearized contract, referencing the types defined in the types section, and is used for verifying that any storage layout changes between subsequent versions are compatible.

> The naming of the file will be <network_name>.json, but note that <network_name> is not taken from the name of the network’s entry in the Truffle or Hardhat configuration file, but is instead inferred from the chain id associated to the entry.

> There is a limited set of public chains; Chains not on the list such as Ethereum Classic will have network files named unknown-<chain_id>.json.

#### Configuration Files in Version Control

> Public network files like mainnet.json or ropsten.json should be tracked in version control. These contain valuable information about your project’s status in the corresponding network, like the addresses of the contract versions that have been deployed. Such files should be identical for all the contributors of a project.

> However, local network files like unknown-<chain_id>.json only represent a project’s deployment in a temporary local network such as ganache-cli that are only relevant to a single contributor of the project and should not be tracked in version control.

> An example .gitignore file could contain the following entries:

```.gitignore
// .gitignore
# OpenZeppelin
.openzeppelin/unknown-*.json
```

#### Multiple inheritance

> Initializer functions are not linearized by the compiler like constructors. Because of this, each \_\_{ContractName}\_init function embeds the linearized calls to all parent initializers. As a consequence, calling two of these init functions can potentially initialize the same contract twice.

> The function \_\_{ContractName}\_init_unchained found in every contract is the initializer function minus the calls to parent initializers, and can be used to avoid the double initialization problem, but doing this manually is not recommended. We hope to be able to implement safety checks for this in future versions of the Upgrades Plugins.

#### Storage gaps

> You may notice that every contract includes **a state variable named \_\_gap**. This is empty reserved space in storage that is put in place in Upgradeable contracts. It **allows us to freely add new state variables in the future** without compromising the storage compatibility with existing deployments.

> It isn’t safe to simply add a state variable because it "shifts down" all of the state variables below in the inheritance chain. This makes the storage layouts incompatible, as explained in Writing Upgradeable Contracts. The size of the \_\_gap array is calculated so that the amount of storage used by a contract always adds up to the same number (in this case 50 storage slots).

### Proxy patterns

> The plugins support the UUPS, transparent, and beacon proxy patterns. **UUPS and transparent proxies are upgraded individually**, whereas any number of beacon proxies can be upgraded atomically at the same time by upgrading the beacon that they point to. For more details on the different proxy patterns available, see the documentation for Proxies.

> **For UUPS and transparent proxies, use deployProxy and upgradeProxy as shown above**. For beacon proxies, use deployBeacon, deployBeaconProxy, and upgradeBeacon. See the documentation for Hardhat Upgrades and Truffle Upgrades for examples.

## Utilities

> The OpenZeppelin Contracts provide a ton of useful utilities that you can use in your project. Here are some of the more popular ones.

### Cryptography

> ECDSA provides functions for recovering and managing Ethereum account ECDSA signatures. These are often generated via web3.eth.sign, and are a 65 byte array (of type bytes in Solidity) arranged the following way: [[v (1)], [r (32)], [s (32)]].

> The data signer can be recovered with ECDSA.recover, and its address compared to verify the signature. Most wallets will hash the data to sign and add the prefix '\x19Ethereum Signed Message:\n', so when attempting to recover the signer of an Ethereum signed message hash, you’ll want to use toEthSignedMessageHash.

```solidity
using ECDSA for bytes32;

function _verify(bytes32 data, bytes memory signature, address account) internal pure returns (bool) {
    return data
        .toEthSignedMessageHash()
        .recover(signature) == account;
}
```

### Math

> The most popular math related library OpenZeppelin Contracts provides is SafeMath, which provides mathematical functions that protect your contract from overflows and underflows.

> Include the contract with using SafeMath for uint256; and then call the functions:

1. myNumber.add(otherNumber)
1. myNumber.sub(otherNumber)
1. myNumber.div(otherNumber)
1. myNumber.mul(otherNumber)
1. myNumber.mod(otherNumber)

### Misc

> Want to check if an address is a contract? Use Address and Address.isContract(). Want to keep track of some numbers that increment by 1 every time you want another one? Check out Counters. This is useful for lots of things, like creating incremental identifiers, as shown on the ERC721 guide.

### Base64

> `Base64` util allows you to transform bytes32 data into its Base64 string representation. This is specially useful to `build URL-safe tokenURIs` for both `ERC721` or `ERC1155`. This library provides a clever way to serve URL-safe Data URI compliant strings to serve **on-chain data structures**.

> Consider this is an example to send JSON Metadata through a Base64 Data URI using an ERC721:

```solidity
// contracts/My721Token.sol
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract My721Token is ERC721 {
    using Strings for uint256;

    constructor() ERC721("My721Token", "MTK") {}

    ...

    // result: data:application/json;base64,eyJuYW1lIjogIk15NzIxVG9rZW4gIzU1In0=
    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "My721Token #', tokenId.toString(), '"',
                // Replace with extra ERC721 Metadata properties
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }
}
```

### Multicall

> The Multicall abstract contract comes with a multicall function that bundles together multiple calls in a single external call. With it, external accounts may perform atomic operations comprising several function calls. This is not only useful for EOAs to make multiple calls in a single transaction, it’s also a way to revert a previous call if a later one fails.

```solidity
// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Multicall.sol";

contract Box is Multicall {
    function foo() public {
        ...
    }

    function bar() public {
        ...
    }
}
```

> This is how to call the multicall function using Truffle, allowing foo and bar to be called in a single transaction:

```js
// scripts/foobar.js

const Box = artifacts.require('Box')
const instance = await Box.new()

await instance.multicall([instance.contract.methods.foo().encodeABI(), instance.contract.methods.bar().encodeABI()])
```

## Using Hooks

> Sometimes, in order to extend a parent contract you will need to override multiple related functions, which leads to code duplication and increased likelihood of bugs.

> For example, consider implementing safe ERC20 transfers in the style of IERC721Receiver. You may think overriding transfer and transferFrom would be enough, but what about \_transfer and \_mint? To prevent you from having to deal with these details, we introduced hooks.

> Hooks are simply functions that are called before or after some action takes place. They provide a centralized point to hook into and extend the original behavior.

> Here’s how you would implement the IERC721Receiver pattern in ERC20, using the \_beforeTokenTransfer hook:

```solidity
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20WithSafeTransfer is ERC20 {
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal virtual override
    {
        super._beforeTokenTransfer(from, to, amount);

        require(_validRecipient(to), "ERC20WithSafeTransfer: invalid recipient");
    }

    function _validRecipient(address to) private view returns (bool) {
        ...
    }

    ...
}
```

> Using hooks this way leads to cleaner and safer code, without having to rely on a deep understanding of the parent’s internals.

### Rules of Hooks

> There’s a few guidelines you should follow when writing code that uses hooks in order to prevent issues. They are very simple, but do make sure you follow them:

1. Whenever you override a parent’s hook, re-apply the virtual attribute to the hook. That will allow child contracts to add more functionality to the hook.

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal virtual override
```

> Always call the parent’s hook in your override using super. This will make sure all hooks in the inheritance tree are called: contracts like ERC20Pausable rely on this behavior.

```solidity
        super._beforeTokenTransfer(from, to, amount); // Call parent hook

```

## Reference

- [OpenZeppelin docs](https://docs.openzeppelin.com/)
- [OpenZeppelin docs : upgradable smart contract](https://docs.openzeppelin.com/learn/upgrading-smart-contracts#whats-in-an-upgrade)
- [OZ - Creating ERC20 Supply](https://docs.openzeppelin.com/contracts/4.x/erc20-supply)
