# Learning Polygon bridge essentials

> A bridge is basically a set of contracts that help in moving assets from the root chain to the child chain. There are primarily two bridges to move assets between Ethereum and Polygon. First one is the Plasma bridge and the second one is called the PoS Bridge or Proof of Stake bridge. Plasma bridge provides an increased security guarantee due to the Plasma exit mechanism.

> However, there are certain restrictions on the child token and there is a 7-day withdrawal period associated with all exits/withdraws from Polygon to Ethereum on the Plasma bridge.

> This is quite painful for those DApps/users who need some flexibility and faster withdrawals, and are happy with the level of security provided by the Polygon Proof-of-Stake bridge, secured by a robust set of external validators.

> Proof of stake based assets provides PoS security and faster exit with one checkpoint interval. 

## Contents

- [Learning Polygon bridge essentials](#learning-polygon-bridge-essentials)
  - [Contents](#contents)
  - [Complete cycle of tranferring assets from Ethereum to Polygon](#complete-cycle-of-tranferring-assets-from-ethereum-to-polygon)
  - [Steps to use the PoS bridge](#steps-to-use-the-pos-bridge)
    - [Deposit](#deposit)
    - [Withdraw](#withdraw)
  - [Mapping Assets using POS](#mapping-assets-using-pos)
    - [Standard Child Token](#standard-child-token)
    - [Custom Child Token](#custom-child-token)
  - [Polygon Mintable Assets](#polygon-mintable-assets)
  - [Reference](#reference)

## Complete cycle of tranferring assets from Ethereum to Polygon

> The complete cycle of transferring assets from Ethereum to Polygon and then back to Ethereum will be explained through this tutorial. In short, the process can be summed up as mentioned below:

1. Owner of the asset (ERC20/ERC721/ERC1155) token has to approve a specific contract on the PoS bridge to spend the amount of tokens to be transferred. This specific contract is called the `Predicate Contract` (deployed on the Ethereum network) which actually locks the amount of tokens to be deposited.

1. Once the approval is given, the next step is to deposit the asset. A function call has to be made on the `RootChainManager` contract which in turn triggers the `ChildChainManager` contract on the Polygon chain.

1. This happens through a state sync mechanism which can be understood in detail from here.

1. The `ChildChainManager` internally calls the `deposit` function of the child token contract and the corresponding amount of asset tokens are minted to the users account. It is important to note that only the `ChildChainManager` can access the deposit function on the child token contract.

1. Once the user gets the tokens, they can be transfered almost instantly with negligible fees on the Polygon chain.

1. Withdrawing assets back to Ethereum is a 2 step process in which the asset tokens has to be _first burnt on the Polygon chain_ and then the proof of this burn transaction has to be submitted on the Ethereum chain.

1. It takes about 20 mins to 3 hours for the burn transaction to be checkpointed into the Ethereum chain. This is done by the Proof of Stake validators.

1. Once the transaction has been added to the check point, a proof of the burn transaction can be submitted on the RootChainManager contract on Ethereum by calling the `exit` function.

1. This function call verifies `the checkpoint inclusion` and then triggers the `Predicate`contract which had locked the asset tokens when the assets were deposited initially.
   
1. As the final step, the predicate contract releases the locked tokens and refunds it to the Users account on Ethereum.

## Steps to use the PoS bridge

> Before we enter into this section of the docs, it may help to have a thorough understanding of these terms as you'll interact with them while trying to use the bridge. Mapping and the State Sync Mechanism

> Done with those links? Let's continue to a high level overview of the flow then.

> The first step to using the PoS bridge is mapping the Root Token and Child Token. Don't worry, this isn't anything complex. It just means that the token contract on the root chain and the token contract on the child chain have to maintain a connection (called mapping) to transfer assets between themselves. If you're interested in submitting a mapping request, please do that here.
At a lower level and with more detail, this is what happens

### Deposit

> The owner of the asset token approves the Predicate Contract to lock down the amount of tokens to be deposited. Once this approval transaction has confirmed, the owner of the asset token interacts with the RootChainManager contract to complete the deposit.

Next up, the asset is deposited with the State Sync Mechanism. if you didn't get a run-through of what the State Sync Mechanism is, it's in its simplest form the native mechanism to send data from Ethereum Network to the Polygon Network. The inner workings of the mechanism itself comprises of a function call that is made of the RootChainManager which triggers the ChildChainManager contract.

### Withdraw

> Withdrawing assets is a breeze with the PoS bridge. It's as simple as burning the asset tokens on the Polygon chain, collecting the transaction hash of this burn transaction, and submitting it to the RootChainManager. The RootChainManager then calls for the predicate contract to release the funds that were locked on the Ethereum chain.

> Once the burn transaction is validated on the Polygon chain, it takes 30 minutes to 3 Hours for this burn transaction to be checkpointed. Checkpointing is the process of merging the Polygon transactions into the Ethereum blockchain.

> Next up, the proof of this burn transaction is submitted to the RootChainManager by calling the exit function. This function call takes in the burnHash for verifying the checkpoint inclusion and only then triggers the Predicate Contract which unlocks and releases the funds that were deposited.

> Once mapping is done, you can either use the `matic.js SDK` to interact with the contracts or you can do the same without the SDK. However, the matic.js SDK is designed in a very user friendly way to make the asset transfer mechanism very easy to integrate with any application.

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