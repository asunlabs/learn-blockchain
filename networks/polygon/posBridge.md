# Learning Polygon bridge essentials

## Contents

- [Learning Polygon bridge essentials](#learning-polygon-bridge-essentials)
  - [Contents](#contents)
  - [Mapping Assets using POS](#mapping-assets-using-pos)
    - [Standard Child Token](#standard-child-token)
    - [Custom Child Token](#custom-child-token)
  - [Polygon Mintable Assets](#polygon-mintable-assets)
  - [Reference](#reference)

## Mapping Assets using POS

> Mapping is necessary in order to transfer your assets to and from the Ethereum and Polygon.

1. The Root chain :: refers to either Goerli or Ethereum Mainnet
1. The Child chain :: refers to either Polygon Mumbai or Polygon Mainnet

> If you already have your token contract deployed on the Root chain and want to move it to Child chain, then you should follow this walkthrough, but if you intend to deploy your contract on Polygon Mainnet first, mint the tokens on the Child chain first and then move them back to the Root chain. You should then follow this guide.

### Standard Child Token

> If you just need a standard ERC20/ERC721/ERC1155 contract, then you can go ahead and submit a mapping request at https://mapper.polygon.technology/ and we will auto deploy the standard child token contract for you.

> Standard Child Token contract will look like these:-

1. ERC20
1. ERC721
1. ERC1155

> Please visit [this link](https://wiki.polygon.technology/docs/develop/ethereum-polygon/submit-mapping-request/) to understand how to create a new mapping request.

### Custom Child Token

- deposit => mint
- withdraw => burn
  
> If you need a custom child token contract which has additional functions to the standard functions, then you will have to deploy your token contracts on the Child chain and [submit a mapping request here](https://mapper.polygon.technology/) and include the address of your deployed child token contract. Let's describe an example of creating a custom child token contract.

> Your custom child contract should follow certain guidelines before you deploy it on the child chain.

> `deposit` method should be present in your custom child contract. This function is called by the `ChildChainManagerProxy` contract whenever a deposit is initiated from the root chain. This deposit function internally mints the token on the child chain.

> `withdraw` method should be present in your custom child contract. It can be called to burn your tokens on the child chain. Burning is the first step of your withdrawal process. This withdraw function will internally burn the token on the child chain.

> These rules need to followed to maintain proper balance of assets between two chains.

> ! Note: No token minting in constructor of child token contract.

**Implementation**

> Now that we covered why we need to implement deposit & withdraw methods in child token contract, we can now proceed for implementing it.

```solidity
pragma solidity 0.6.6;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ChildERC20 is ERC20,
{
    using SafeMath for uint256;

    constructor(string memory name, string memory symbol, uint8 decimals) public ERC20(name, symbol) {
        
        _setupDecimals(decimals);
        // can't mint here, because minting in child chain smart contract's constructor not allowed
        // _mint(msg.sender, 10 ** 27);
    
    }

    function deposit(address user, bytes calldata depositData) external {
        uint256 amount = abi.decode(depositData, (uint256));

        // `amount` token getting minted here & equal amount got locked in RootChainManager
        _totalSupply = _totalSupply.add(amount);
        _balances[user] = _balances[user].add(amount);
        
        emit Transfer(address(0), user, amount);
    }

    function withdraw(uint256 amount) external {
        _balances[msg.sender] = _balances[msg.sender].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        
        emit Transfer(msg.sender, address(0), amount);
    }
}
```

> One thing you might notice in the code sample above is that the deposit function can be called by anyone, which is not allowed. In order to prevent this, we're going to make sure it can only be called by ChildChainManagerProxy. (ChildChainManagerProxy - [on Mumbai](https://mumbai.polygonscan.com/address/0xb5505a6d998549090530911180f38aC5130101c6/transactions) , [on Polygon Mainnet](https://polygonscan.com/address/0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa/) )

```solidity
pragma solidity 0.6.6;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ChildERC20 is ERC20,
{
    using SafeMath for uint256;
    // keeping it for checking, whether deposit being called by valid address or not
    address public childChainManagerProxy;
    address deployer;

    constructor(string memory name, string memory symbol, uint8 decimals, address _childChainManagerProxy) public ERC20(name, symbol) {
        
        _setupDecimals(decimals);
        childChainManagerProxy = _childChainManagerProxy;
        deployer = msg.sender;

        // Can't mint here, because minting in child chain smart contract's constructor not allowed
        //
        // In case of mintable tokens it can be done, there can be external mintable function too
        // which can be called by some trusted parties
        // _mint(msg.sender, 10 ** 27);
    
    }

    // being proxified smart contract, most probably childChainManagerProxy contract's address
    // is not going to change ever, but still, lets keep it 
    function updateChildChainManager(address newChildChainManagerProxy) external {
        require(newChildChainManagerProxy != address(0), "Bad ChildChainManagerProxy address");
        require(msg.sender == deployer, "You're not allowed");

        childChainManagerProxy = newChildChainManagerProxy;
    }

    function deposit(address user, bytes calldata depositData) external {
        require(msg.sender == childChainManagerProxy, "You're not allowed to deposit");

        uint256 amount = abi.decode(depositData, (uint256));

        // `amount` token getting minted here & equal amount got locked in RootChainManager
        _totalSupply = _totalSupply.add(amount);
        _balances[user] = _balances[user].add(amount);
        
        emit Transfer(address(0), user, amount);
    }

    function withdraw(uint256 amount) external {
        _balances[msg.sender] = _balances[msg.sender].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        
        emit Transfer(msg.sender, address(0), amount);
    }

}
```

> This updated implementation can be used for mapping.

Steps :

1. Deploy root token on root chain i.e. {Goerli, Ethereum Mainnet}
1. Ensure your child token has the deposit & withdraw functions.
1. Deploy the child token on child chain i.e. {Polygon Mumbai, Polygon Mainnet}
1. Submit a mapping request, to be resolved by team.

> Request Submission: Please go use [this link](https://mapper.polygon.technology/) to submit a mapping request.

## Polygon Mintable Assets

**What are Polygon mintable tokens?**

> Assets can be transferred to and from across the Ethereum and Polygon chain using the PoS bridge. These assets include ERC20, ERC721, ERC1155 and many other token standards. Most of the assets are pre-existing on Ethereum chain. But new assets can be created on the Polygon chain as well and moved back to Ethereum chain as and when required. This can save lots of gas and time that is spent on token minting on Ethereum. Creation of assets on the Polygon chain is much easier and a more recommended approach. These assets can be moved to Ethereum chain when required. Such type of assets are called Polygon mintable assets.

> In the case of Polygon Mintable tokens, assets are created on Polygon. When a Polygon minted asset has to be moved to Ethereum, the asset has to be burned first and then **a proof of this burn transaction has to be submitted on the Ethereum chain**. The `RootChainManager` contract calls a special predicate contract internally. This predicate contract directly calls the mint function of the asset contract on Ethereum and the tokens are minted to the users address. This special predicate is called the `MintableAssetPredicate`.

**What are the requirements to be satisfied?**

> There are a few conditions that have to be strictly followed when we have to create an asset on Polygon and then move it back to Ethereum.

**Contract to be deployed on Polygon chain**

> You can either deploy

> A mintable token contract on the Polygon chain or Submit a mapping request and the mintable token contract can be autodeployed for you on the Polygon chain via the Mapper tool. You just need to submit a mapping request at https://mapper.polygon.technology/ and leave the child contract field blank in the form. Also, do remember to choose the Mintable option in the form.

> If you want to deploy the contract by yourself, then the child contract should look like the following. You are free to make custom changes to this contract, but ensure that the deposit, withdraw and mint functions are present.

1. ChildMintableERC20 - https://github.com/maticnetwork/pos-portal/blob/master/flat/ChildMintableERC20.sol
1. ChildMintableERC721 - https://github.com/maticnetwork/pos-portal/blob/master/flat/ChildMintableERC721.sol
1. ChildMintableERC1155 - https://github.com/maticnetwork/pos-portal/blob/master/flat/ChildMintableERC1155.sol

> Most importantly, the child manager contract on Polygon should be given the depositor role in the asset contract deployed on Polygon. Only this child manager proxy address should have the rights to deposit tokens on Polygon.

> Be sure to verify both contracts on Polygonscan and Etherscan accordingly, before submitting mapping request.

> Child Manager contract addresses:

```
Mumbai: 0xb5505a6d998549090530911180f38aC5130101c6
Mainnet: 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa
```

> Please do mention the contract address of the deployed child token when you submit the mapping request.

Note that the Ethereum contract needs to be deployed as shown in the next step - no minting needs to be done on Ethereum though. It is required so that tokens can be withdrawn to Ethereum if need be.


**Contract to be deployed on Ethereum**

> A token contract has to be deployed on the Ethereum chain and it should look like this.

1. MintableERC20 - https://github.com/maticnetwork/pos-portal/blob/master/flat/DummyMintableERC20.sol
1. MintableERC721 - https://github.com/maticnetwork/pos-portal/blob/master/flat/DummyMintableERC721.sol
1. MintableERC1155 - https://github.com/maticnetwork/pos-portal/blob/master/flat/DummyMintableERC1155.sol

> Most importantly, The MintableAssetProxy contract deployed on Ethereum should be given the minter role in the asset contract deployed on Ethereum. Only this predicate proxy address should have the rights to mint tokens on Ethereum.

This role can be granted by calling the grantRole() function in the token contracts on the root chain. The first parameter is the value of `PREDICATE_ROLE` constant which is `0x12ff340d0cd9c652c747ca35727e68c547d0f0bfa7758d2e77f75acef481b4f2` and the second parameter is the token predicate proxy address which is given below,

```
Ethereum Mainnet
"MintableERC20PredicateProxy"  : "0x9923263fA127b3d1484cFD649df8f1831c2A74e4",
"MintableERC721PredicateProxy" : "0x932532aA4c0174b8453839A6E44eE09Cc615F2b7",
"MintableERC1155PredicateProxy": "0x2d641867411650cd05dB93B59964536b1ED5b1B7",
```

```
Goerli Testnet
"MintableERC20PredicateProxy"  : "0x37c3bfC05d5ebF9EBb3FF80ce0bd0133Bf221BC8",
"MintableERC721PredicateProxy" : "0x56E14C4C1748a818a5564D33cF774c59EB3eDF59",
"MintableERC1155PredicateProxy": "0x72d6066F486bd0052eefB9114B66ae40e0A6031a",
```

## Reference

- [Mapping Assets using POS](https://wiki.polygon.technology/docs/develop/ethereum-polygon/pos/mapping-assets)