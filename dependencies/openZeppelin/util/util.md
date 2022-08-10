# Learning OZ util contract

> The OpenZeppelin Contracts provide a ton of useful utilities that you can use in your project. Here are some of the more popular ones.

## Cryptography

### Checking Signatures On-Chain

> ECDSA provides functions for **recovering and managing Ethereum account ECDSA signatures**. These are often generated via web3.eth.sign, and are a **65 byte array (of type bytes in Solidity)** arranged the following way: `[[v (1)], [r (32)], [s (32)]]`.

- in Ethers.js, it will be like `signer.signMessage()`

> The data signer can be recovered with ECDSA.recover, and its address compared to verify the signature. Most wallets will hash the data to sign and add the prefix `'\x19Ethereum Signed Message:\n'`, so when attempting to **recover the signer of an Ethereum signed message hash**, you’ll want to use toEthSignedMessageHash.

```solidity
using ECDSA for bytes32;

function _verify(bytes32 data, bytes memory signature, address account) internal pure returns (bool) {
    return data
        .toEthSignedMessageHash()
        .recover(signature) == account;
}
```

> Getting signature verification right is not trivial: make sure you fully read and understand ECDSA's documentation.

## Verifying Merkle Proofs

> MerkleProof provides:

- verify - can prove that some value is part of a Merkle tree.
- multiProofVerify - can prove multiple values are part of a Merkle tree.

## Introspection

> In Solidity, it’s frequently helpful to know whether or not a contract supports an interface you’d like to use. **ERC165** is a standard that helps do **runtime interface detection**. Contracts provide helpers both for implementing ERC165 in your contracts and querying other contracts:

> IERC165 — this is the ERC165 interface that defines supportsInterface. When implementing ERC165, you’ll conform to this interface.

> ERC165 — inherit this contract if you’d like to support interface detection using a lookup table in contract storage. **You can register interfaces using _registerInterface(bytes4)**: check out example usage as part of the ERC721 implementation.

> **ERC165Checker** — ERC165Checker simplifies the process of checking whether or not a contract supports an interface you care about.

```
myAddress._supportsInterface(bytes4)
myAddress._supportsAllInterfaces(bytes4[])
```

> include with using ERC165Checker for address;

```solidity 
contract MyContract {
    using ERC165Checker for address;

    bytes4 private InterfaceId_ERC721 = 0x80ac58cd;

    /**
     * @dev transfer an ERC721 token from this contract to someone else
     */
    function transferERC721(
        address token,
        address to,
        uint256 tokenId
    )
        public
    {
        require(token.supportsInterface(InterfaceId_ERC721), "IS_NOT_721_TOKEN");
        IERC721(token).transferFrom(address(this), to, tokenId);
    }
}
```

## Math

> The most popular math related library OpenZeppelin Contracts provides is SafeMath, which provides mathematical functions that protect your contract from overflows and underflows.

> Include the contract with using SafeMath for uint256; and then call the functions:

```solidity
import "@openzeppelin/contracts/utils/math/SafeMath.sol"; 

using SafeMath for uint256;
myNumber.tryAdd(otherNumber)

myNumber.trySub(otherNumber)

myNumber.tryDiv(otherNumber)

myNumber.tryMul(otherNumber)

myNumber.tryMod(otherNumber)
```

<details>
<summary>Note: ver 0.8+</summary>

> `SafeMath` is generally not needed starting with Solidity 0.8, since the compiler now has built in overflow checking.
</details>

## Payment

> Want to split some payments between multiple people? Maybe you have an app that sends 30% of art purchases to the original creator and 70% of the profits to the current owner; you can build that with PaymentSplitter!

> In Solidity, there are some security concerns with blindly sending money to accounts, since it allows them to execute arbitrary code. You can read up on these security concerns in the Ethereum Smart Contract Best Practices website. One of the ways to fix reentrancy and stalling problems is, instead of immediately sending Ether to accounts that need it, you can use PullPayment, which offers an `_asyncTransfer` function for sending money to something and requesting that they `withdrawPayments()` it later.

> If you want to Escrow some funds, check out Escrow and ConditionalEscrow for governing the release of some escrowed Ether.

## Collections

> If you need support for more powerful collections than Solidity’s native arrays and mappings, take a look at EnumerableSet and EnumerableMap. They are similar to mappings in that they store and remove elements in constant time and don’t allow for repeated entries, but they also support enumeration, which means you can easily query all stored entries both on and off-chain.

## Misc

> Want to check if an address is a contract? Use Address and Address.isContract().

> It is unsafe to assume that an address for which this function returns false is an externally-owned account (EOA) and not a contract. Among others, isContract will return false for the following types of addresses:

1. an externally-owned account
1. a contract in construction
1. an address where a contract will be created
1. an address where a contract lived, but was destroyed

> Want to keep track of some numbers that increment by 1 every time you want another one? Check out Counters. This is useful for lots of things, like creating incremental identifiers, as shown on the ERC721 guide.

<details>
<summary>Do NOT rely on isContract solely</summary>

> You shouldn’t rely on isContract to protect against flash loan attacks! Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract constructor.
</details>

## Multicall

> The Multicall abstract contract comes with a multicall function that bundles together multiple calls in a single external call. With it, external accounts may perform atomic operations comprising several function calls. This is not only useful for EOAs to make multiple calls in a single transaction, it’s also a way to revert a previous call if a later one fails.

> Consider this dummy contract:

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

```solidity
// scripts/foobar.js

const Box = artifacts.require('Box');
const instance = await Box.new();

await instance.multicall([
    instance.contract.methods.foo().encodeABI(),
    instance.contract.methods.bar().encodeABI()
]);
```