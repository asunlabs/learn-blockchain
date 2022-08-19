# Learning cross-chain solution 

> If your contract is targeting to be used in the context of multichain operations, you may need specific tools to identify and process these cross-chain operations. OpenZeppelin provides the CrossChainEnabled abstract contract, that includes dedicated internal functions.

> In this guide, we will go through an example use case: how to build an upgradeable & mintable ERC20 token controlled by a governor present on a foreign chain.

## Starting point, our ERC20 contract

> Let’s start with a small ERC20 contract, that we bootstrapped using the OpenZeppelin Contracts Wizard, and extended with an owner that has the ability to mint. Note that for demonstration purposes we have not used the built-in Ownable contract.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyToken is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC20_init("MyToken", "MTK");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
```

> This token is mintable and upgradeable by the owner of the contract.

## Preparing our contract for cross-chain operations.

> Let’s now imagine that this contract is going to live on one chain, but we want the minting and the upgrading to be performed by a governor contract on another chain.

> For example, we could have our token on xDai, with our governor on mainnet, or we could have our token on mainnet, with our governor on optimism

> In order to do that, we will start by adding CrossChainEnabled to our contract. You will notice that the contract is now abstract. This is because CrossChainEnabled is an abstract contract: it is not tied to any particular chain and it deals with cross-chain interactions in an abstract way. This is what enables us to easily reuse the code for different chains. We will specialize it later by inheriting from a chain-specific implementation of the abstraction.

```git
 import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
+import "@openzeppelin/contracts-upgradeable/crosschain/CrossChainEnabled.sol";

-contract MyToken is Initializable, ERC20Upgradeable, UUPSUpgradeable {
+abstract contract MyTokenCrossChain is Initializable, ERC20Upgradeable, UUPSUpgradeable, CrossChainEnabled {
```

> Once that is done, we can use the onlyCrossChainSender modifier, provided by CrossChainEnabled in order to protect the minting and upgrading operations.

```git
-    function mint(address to, uint256 amount) public onlyOwner {
+    function mint(address to, uint256 amount) public onlyCrossChainSender(owner) {

-    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
+    function _authorizeUpgrade(address newImplementation) internal override onlyCrossChainSender(owner) {
```

>  This change will effectively restrict the mint and upgrade operations to the owner on the remote chain.

## Specializing for a specific chain

> Once the abstract cross-chain version of our token is ready we can easily specialize it for the chain we want, or more precisely for the bridge system that we want to rely on.

> This is done using one of the many CrossChainEnabled implementations.

> For example, if our token on xDai, and our governor on mainnet, we can use the AMB bridge available on xDai at 0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59

```solidity
import "@openzeppelin/contracts-upgradeable/crosschain/amb/CrossChainEnabledAMB.sol";

contract MyTokenXDAI is
    MyTokenCrossChain,
    CrossChainEnabledAMB(0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59)
{}
```

> If the token is on Ethereum mainnet, and our governor on Optimism, we use the Optimism CrossDomainMessenger available on mainnet at 0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1.

```solidity
import "@openzeppelin/contracts-upgradeable/crosschain/optimismCrossChainEnabledOptimism.sol";

contract MyTokenOptimism is
    MyTokenCrossChain,
    CrossChainEnabledOptimism(0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
{}
```

## Mixing cross domain addresses is dangerous

> When designing a contract with cross-chain support, it is essential to understand possible fallbacks and the security assumption that are being made.

> In this guide, we are particularly focusing on restricting access to a specific caller. This is usually done (as shown above) using msg.sender or _msgSender()

> However, when going cross-chain, it is not just that simple. Even without considering possible bridge issues, **it is important to keep in mind that the same address can correspond to very different entities when considering a multi-chain space**.

> EOA wallets can _only_ execute operations if the _wallet’s private-key signs the transaction_. To our knowledge this is the case in all EVM chains, so a cross-chain message coming from such a wallet is arguably equivalent to a non-cross-chain message by the same wallet. The situation is however very different for smart contracts.

> Due to the way smart contract addresses are computed, and the fact that **smart contracts on different chains live independent lives**, you could have two very different contracts live at the same address on different chains

> You could imagine two multisig wallets with different signers use the same address on different chains. You could also see a very basic smart wallet live on one chain at the same address as a full-fledge governor on another chain. Therefore, **you should be careful that whenever you give permissions to a specific address**, you control with chain this address can act from.

## Going further with access control

> In previous example, we have both a onlyOwner() modifier and the onlyCrossChainSender(owner) mechanism. We didn’t use **the Ownable pattern** because the ownership transfer mechanism in includes is **not designed to work with the owner being a cross-chain entity**. Unlike Ownable, AccessControl is more effective at capturing the nuances and can effectivelly be used to build cross-chain-aware contracts.

> Using AccessControlCrossChain includes both the AccessControl core and the CrossChainEnabled abstraction. It also includes some binding to make role management compatible with cross-chain operations.

> In the case of the mint function, **the caller must have the MINTER_ROLE when the call originates from the same chain**. If the caller is on a remote chain, then the caller should not have the MINTER_ROLE, but the "aliased" version (MINTER_ROLE ^ CROSSCHAIN_ALIAS). **This mitigates the danger described in the previous section by strictly separating local accounts from remote accounts from a different chain**. See the AccessControlCrossChain documentation for more details.

```git
 import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
 import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
+import "@openzeppelin/contracts-upgradeable/access/AccessControlCrossChainUpgradeable.sol";

-abstract contract MyTokenCrossChain is Initializable, ERC20Upgradeable, UUPSUpgradeable, CrossChainEnabled {
+abstract contract MyTokenCrossChain is Initializable, ERC20Upgradeable, UUPSUpgradeable, AccessControlCrossChainUpgradeable {

-    address public owner;
-    modifier onlyOwner() {
-        require(owner == _msgSender(), "Not authorized");
-        _;
-    }

+    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
+    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

     function initialize(address initialOwner) initializer public {
         __ERC20_init("MyToken", "MTK");
         __UUPSUpgradeable_init();
+        __AccessControl_init();
+        _grantRole(_crossChainRoleAlias(DEFAULT_ADMIN_ROLE), initialOwner); // initialOwner is on a remote chain
-        owner = initialOwner;
     }

-    function mint(address to, uint256 amount) public onlyCrossChainSender(owner) {
+    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {

-    function _authorizeUpgrade(address newImplementation) internal override onlyCrossChainSender(owner) {
+    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {
```

> This results in the following, final, code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlCrossChainUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

abstract contract MyTokenCrossChain is Initializable, ERC20Upgradeable, AccessControlCrossChainUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address initialOwner) initializer public {
        __ERC20_init("MyToken", "MTK");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(_crossChainRoleAlias(DEFAULT_ADMIN_ROLE), initialOwner); // initialOwner is on a remote chain
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal onlyRole(UPGRADER_ROLE) override {
    }
}

import "@openzeppelin/contracts-upgradeable/crosschain/amb/CrossChainEnabledAMB.sol";

contract MyTokenXDAI is
    MyTokenCrossChain,
    CrossChainEnabledAMB(0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59)
{}

import "@openzeppelin/contracts-upgradeable/crosschain/optimismCrossChainEnabledOptimism.sol";

contract MyTokenOptimism is
    MyTokenCrossChain,
    CrossChainEnabledOptimism(0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
{}
```

## Reference

- [Adding cross-chain support to contracts](https://docs.openzeppelin.com/contracts/4.x/crosschain)