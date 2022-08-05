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

```