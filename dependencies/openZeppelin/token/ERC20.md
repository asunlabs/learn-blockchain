# Learning OZ ERC20

> There a few core contracts that implement the behavior specified in the EIP

1. IERC20: the interface all ERC20 implementations should conform to.
1. IERC20Metadata: the extended ERC20 interface including the name, symbol and decimals functions.
1. ERC20: the implementation of the ERC20 interface, including the name, symbol and decimals optional standard extension to the base interface.

## Creating ERC20 supply

> In this guide you will learn how to create an ERC20 token with a custom supply mechanism. We will showcase two idiomatic ways to use OpenZeppelin Contracts for this purpose that you will be able to apply to your smart contract development practice.

> The standard interface implemented by tokens built on Ethereum is called ERC20, and Contracts includes a widely used implementation of it: the aptly named ERC20 contract. This contract, like the standard itself, is quite simple and bare-bones. In fact, if you try to deploy an instance of ERC20 as-is it will be quite literally useless…​ it will have no supply! What use is a token with no supply?

> The way that supply is created is not defined in the ERC20 document. Every token is free to experiment with its own mechanisms, ranging from the most decentralized to the most centralized, from the most naive to the most researched, and more.

### Fixed Supply

> Let’s say we want a token with a fixed supply of 1000, initially allocated to the account that deploys the contract. If you’ve used Contracts v1, you may have written code like the following:

```solidity
contract ERC20FixedSupply is ERC20 {
    constructor() {
        totalSupply += 1000;
        balances[msg.sender] += 1000;
    }
}
```

> Starting with Contracts v2 this pattern is not only discouraged, but disallowed. The variables totalSupply and balances are now private implementation details of ERC20, and you can’t directly write to them. Instead, there is an internal \_mint function that will do exactly this:

```solidity
contract ERC20FixedSupply is ERC20 {
    constructor() ERC20("Fixed", "FIX") {
        _mint(msg.sender, 1000);
    }
}
```

> Encapsulating state like this makes it safer to extend contracts. For instance, in the first example we had to manually keep the totalSupply in sync with the modified balances, which is easy to forget. In fact, we omitted something else that is also easily forgotten: the Transfer event that is required by the standard, and which is relied on by some clients. The second example does not have this bug, because the internal \_mint function takes care of it.

## Rewarding miners

> The internal \_mint function is the key building block that allows us to write ERC20 extensions that implement a supply mechanism.

> The mechanism we will implement is a token reward for the miners that produce Ethereum blocks. In Solidity we can access the address of the current block’s miner in the global variable block.coinbase. We will mint a token reward to this address whenever someone calls the function mintMinerReward() on our token. The mechanism may sound silly, but you never know what kind of dynamic this might result in, and it’s worth analyzing and experimenting with!

```solidity
contract ERC20WithMinerReward is ERC20 {
    constructor() ERC20("Reward", "RWD") {}

    function mintMinerReward() public {
        _mint(block.coinbase, 1000);
    }
}
```

> As we can see, \_mint makes it super easy to do this correctly.

## Modularizing the Mechanism

> There is one supply mechanism already included in Contracts: ERC20PresetMinterPauser. This is a generic mechanism in which a set of accounts is assigned the minter role, granting them the permission to call a mint function, an external version of \_mint.

> This can be used for centralized minting, where an externally owned account (i.e. someone with a pair of cryptographic keys) decides how much supply to create and for whom. There are very legitimate use cases for this mechanism, such as traditional asset-backed stablecoins.

> The accounts with the minter role don’t need to be externally owned, though, and can just as well be smart contracts that implement a trustless mechanism. We can in fact implement the same behavior as the previous section.

```solidity
contract MinerRewardMinter {
    ERC20PresetMinterPauser _token;

    constructor(ERC20PresetMinterPauser token) {
        _token = token;
    }

    function mintMinerReward() public {
        _token.mint(block.coinbase, 1000);
    }
}
```

> This contract, when initialized with an ERC20PresetMinterPauser instance, and granted the minter role for that contract, will result in exactly the same behavior implemented in the previous section. What is interesting about using ERC20PresetMinterPauser is that we can easily combine multiple supply mechanisms by assigning the role to multiple contracts, and moreover that we can do this dynamically.

## Automating the Reward

> So far our supply mechanisms were triggered manually, but ERC20 also allows us to extend the core functionality of the token through the \_beforeTokenTransfer hook (see Using Hooks).

> Adding to the supply mechanism from previous sections, we can use this hook to mint a miner reward for every token transfer that is included in the blockchain.

```solidity
contract ERC20WithAutoMinerReward is ERC20 {
    constructor() ERC20("Reward", "RWD") {}

    function _mintMinerReward() internal {
        _mint(block.coinbase, 1000);
    }

    function _beforeTokenTransfer(address from, address to, uint256 value) internal virtual override {
        if (!(from == address(0) && to == block.coinbase)) {
          _mintMinerReward();
        }
        super._beforeTokenTransfer(from, to, value);
    }
}
```