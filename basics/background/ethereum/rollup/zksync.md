# Learning zkSync Essentials

> Rely on math, not validators

> zkSync is Ethereum’s most user-centric ZK rollup zkSync solves Ethereum scalability with zero security compromises

> zkSync is a mission-driven project. Its purpose is to break financial barriers and enhance world’s freedom — by **accelerating the mass adoption of public blockchains**. 

## Introduction to zkSync for Developers

> zkSync is a scaling and privacy engine for Ethereum. Its current functionality scope includes low gas transfers of ETH and ERC20 tokens in the Ethereum network, atomic swaps & limit orders as well as native L2 NFT support. This document is a high-level description of the zkSync development ecosystem.

> zkSync is built on ZK Rollup architecture. ZK Rollup is an L2 scaling solution in which _all funds are held by a smart contract on the mainchain_, while _computation and storage are performed off-chain_. For every Rollup block, a state transition zero-knowledge proof (SNARK) is generated and verified by the mainchain contract. This SNARK includes the proof of the validity of every single transaction in the Rollup block. Additionally, the public data _update for every block is published over the mainchain network in the cheap calldata_.

> This architecture provides the following guarantees:

1. The Rollup validator(s) can never corrupt the state or steal funds (unlike Sidechains).

1. Users can always retrieve the funds from the Rollup even if validator(s) stop cooperating because the data is available (unlike Plasma).

1. Thanks to validity proofs, neither users nor a single other trusted party needs to be online to monitor Rollup blocks in order to prevent fraud (unlike payment channels or Optimistic Rollups).

> In other words, ZK Rollup strictly inherits the security guarantees of the underlying L1.

## Capabilities

> First of all, zkSync, as a scaling solution, is capable of making transfers, and doing them quick and cheap. Interfaces and principles of the `core zkSync functionality` are covered in the `payments section` of this documentation.

> Secondly, zkSync is smart-contract friendly. As of February 2022, zkSync 2.0 testnet has been live featuring smart contracts in Solidity or reusing existing Solidity code. `Contracts interoperability` is covered in the `contracts section` and you can find more details in the zkSync 2.0 Documentation

>  Thirdly, zkSync is friendly for exchanges. `Atomic swaps` — an essential component of exchange protocols — are already available on mainnet!

> Fourthly, zkSync has `native support of NFTs`. You can try it out in our wallet (opens new window).

> Finally, zkSync support is `implemented for all the main platforms`. Check out our SDK section of docs, and start developing with zkSync!

<details>
<summary>zkSync SDK</summary>

1. JavaScript / TypeScript
1. Rust
1. Android (Java)
1. IOS (Swift)
1. Python
1. Dart This is an unofficial open-sourced SDK for zkSync
</details>

## Basic Concepts

### Operations

> There are two types of operations in zkSync:

1. Priority operations
1. Transactions

**Priority operations**

> _Priority operations_ are initiated directly on the _Ethereum mainnet_. For example, the user creates a deposit transaction to move funds from Ethereum to zkSync. A priority operation can be identified with a numeric ID or hash of the ethereum transaction that created it.

> `Deposit`: Moves funds from the Ethereum network to the designated account in the zkSync network. If the recipient account does not exist yet on the zkSync network, it will be created and a numeric ID will be assigned to the provided address.

- Deposit: from Ethereum mainnet to zkSync network

> `FullExit`: Withdraws funds from the zkSync network to the Ethereum network _without interacting with the zkSync server_. This operation can be used as an emergency exit in case of detected censorship from the zkSync server node, or to withdraw funds in the situation where the signing key for an account in zkSync network cannot be set (e.g. if the address corresponds to a smart contract).

- FullExit: from zkSync to Ethereum mainnet

### Transactions

> Transactions must be submitted via zkSync operator using the API. Transactions are identified by the hash of their serialized representation. Currently, there are the following types of transactions:

> `ChangePubKey`: Sets (or changes) the signing key associated with the account. Without a signing key set, no operation (except for priority operations) can be authorized by the corresponding account.

> `Transfer`: **Transfers funds from one zkSync account to another zkSync account**. If the recipient account does not exist yet on the zkSync network, it will be created and a numeric ID will be assigned to the provided address.

> `Swap`: Atomically swaps funds between two existing zkSync accounts.

> `Withdraw`: Withdraws funds from the zkSync network to the Ethereum network.

> `ForcedExit`: Withdraws funds from the "target" L2 account that doesn't have a signing key set, to the same "target" address on the Ethereum network. This operation can be used to withdraw funds in the situation where the signing key for account in zkSync network cannot be set (e.g. if address corresponds to a smart contract).

> `MintNFT`: Mints an NFT based on provided content hash to the provided "recipient".

> `WithdrawNFT`: Withdraw an NFT from the zkSync network to the Ethereum network.

## Blocks

> All operations inside zkSync are arranged in blocks. After zkSync operator creates a block, it is pushed to the zkSync smart contract on the Ethereum mainnet with a Commit transaction. **When a block is committed, its state is not yet final**. After a couple of minutes, the ZK proof for the correctness of this block is produced. This proof is published on Ethereum using the Verify transaction. **Only after the Verify tx was mined, the new state is considered final**. Multiple blocks can be committed but not verified yet.

> However, the execution model is slightly different: in order to not make users wait for the block finalization, transactions are grouped into "mini-blocks" with a much smaller timeout. So, the blocks are being partially applied with a small interval, so that shortly after receiving the transaction it is executed and L2 state is updated correspondingly.

> It means that after sending a transaction, **the user has to wait for neither block commitment nor verification**, and transferred _funds can be used immediately_ after corresponding transaction execution.

## Flow

> This section describes typical use-cases of zkSync in a sequential manner.

### Creating an account

> Accounts in zkSync can be created by either doing a deposit of funds from Ethereum or by transferring funds in zkSync to the desired address. Any of these options will create a new account in the zkSync network if it doesn't exist.

> However, newly created accounts are not capable of authorizing any transactions from it yet. In order to do so, **the account owner must set the signing key for their account**.

### Setting the signing key

> **By default, the signing key for each account is set to the zero value**, which marks account as _"unowned"_. It's a requirement because of the following reasons:

1. If a transfer to some address is valid in Ethereum, it's also valid in zkSync.
1. Not every address can have a private key (e.g. some smart contracts).
1. Transfers to a user's account may happen before they've been interested in zkSync.

> Thus, in order to **make an account capable of initiating L2 transactions**, the user must set a signing key for it via `ChangePubKey` transaction.

> This transaction has to have two signatures:

1. zkSync signature of the transaction data, so that it won't be possible to mutate transaction contents.
1. Ethereum signature proving account ownership.

> _Ethereum signature should be a signature of some pre-defined message_. Also, it is possible to authorize `ChangePubKey` operation on-chain by sending a corresponding transaction to the zkSync smart contract. Ownership of account will be checked by both zkSync server and smart contract for better security guarantees.

> **The zkSync signature on all transaction fields must correspond to the public key provided in the transaction**.

**Warning**

> To keep the default Layer-2 private key different among different networks, the message that the user signs depends on the network of the Ethereum provider of the user's wallet.

> That's why if your solution supports multiple chains (for example mainnet & rinkeby), **please make sure that the user is signing ChangePubKey only after the transition to the correct network**. Otherwise, the user will have _ChangePubKey-related errors_ when he'll try to use zkWallet or other zkSync products and may pay for CPK one more time.

### Transferring funds

> As mentioned above, any transfer that is valid in Ethereum, is also valid in zkSync.

> Users may transfer any amount of funds in either Ether or any supported ERC-20 token. A list of supported tokens can be found on the corresponding [explorer page](https://zkscan.io/explorer/tokens/). It is also exposed via API.

> However, **transfer to a non-existent account requires slightly more data to be sent** on the smart contract (we have to include information about the new account), thus the fee for such transfers is slightly higher than the fee for transfers to existing accounts.

### Fees

> zkSync requires fees for transactions in order to cover expenses for network maintenance. Fees for each kind of transaction are calculated based on three main factors:

1. Amount of data that will be sent to the Ethereum network.
1. Current gas price.
1. Cost of computational resources to generate a proof for a block with the transaction.

> Since we include many transactions in one block, the cost is amortized among all the included transactions, which results in very small fee values.

> Additionally, our API provides all the input data used for fee calculation via corresponding API method.

### Withdrawting funds

> Currently, there are three ways to withdraw funds from zkSync to an Ethereum account. 

> First one is `Withdraw` transaction.

> It is an L2 transaction that can be used to request a withdrawal from your account to any Ethereum address. Same way as transfers, **it has to be signed by the correct zkSync private key**.

> This method is preferred for situations when you own your account and have a private key for it. 

> Second one is `ForcedExit` transaction.

> It is an L2 transaction that can be used to request a withdrawal from any unowned account (one that does not have a signing key set). Neither Ethereum address nor amount can be chosen in this transaction: the only option is to request a withdrawal of all available funds of a certain token from the target L2 address to the target L1 address.

> Also, the transaction initiator should cover the fee, which is exactly the same as for Withdraw operation.

> This method is **preferred if funds should be withdrawn from an account that cannot set the signing key (i.e. smart contract account)**, and there exists an L2 account which can send this type of transaction.

> Third one is FullExit priority operation.

> This kind of operation is called a "priority operation" since it's initiated from L1 and the smart contract provides guarantees that either this request will be processed within a reasonable time interval, or network will be considered compromised / dead, and the contract will enter an exodus mode.

> This method is **preferred if the user will ever experience censorship from the network operator**.

## Sending Transactions

> This section explains principles of sending transactions into the zkSync network. Provided examples are written in JavaScript, but aren't tied to any certain SDK.

### Sending priority operations

> Priority operations are invoked via calling the corresponding smart contract methods.

> Signatures of corresponding deposit methods:

```solidity
/// @notice Deposit ETH to Layer 2 - transfer ether from user into contract, validate it, register deposit
/// @param _franklinAddr The receiver Layer 2 address
function depositETH(address _franklinAddr) external payable nonReentrant;

/// @notice Deposit ERC20 token to Layer 2 - transfer ERC20 tokens from user into contract, validate it, register deposit
/// @param _token Token address
/// @param _amount Token amount
/// @param _franklinAddr Receiver Layer 2 address
function depositERC20(IERC20 _token, uint104 _amount, address _franklinAddr) external nonReentrant;
```

> Note that prior to deposit of ERC20 funds, corresponding amount of funds must be approved for contract, e.g. (in JS):

```js
erc20contract.approve(zkSyncContractAddress, deposit_amount);
```

> To perform a full exit, user must sequentially register an exit request (via fullExit contract call), and then complete this request (via completeWithdrawals call).

> Signatures of corresponding methods:

```solidity
/// @notice Register full exit request - pack pubdata, add priority request
/// @param _accountId Numerical id of the account in the zkSync network
/// @param _token Token address, 0 address for ether
function fullExit (uint32 _accountId, address _token) external nonReentrant;

/// @notice executes pending withdrawals
/// @param _n The number of withdrawals to complete starting from oldest
function completeWithdrawals(uint32 _n) external nonReentrant;
```

### Sending transactions

> In order to send a transaction, the user has to do the following steps:

1. Prepare the transaction data.
1. Encode the transaction data into a byte sequence.
1. Create a zkSync signature for these bytes with the zkSync private key.
1. Either generate an Ethereum signature for transaction description (see details below) or provide an EIP-1271 signature.
1. Send the transaction via corresponding JSON RPC method.

> Details on transaction data and encoding it into byte sequence could be found in the formal protocol description (opens new window).

> To see the programming language support for signing primitives, see the cryptography section.

> Messages for Ethereum signatures depend on the transaction type:

```js
// Amount and fee must be encoded into formatted string, e.g. by `ethers.utils.formatUnits` method
// with respect to the token decimals value.
// Token must be represented as a token symbol, e.g. `ETH` or `DAI`.

// For Transfer:
const transferEthMessage =
  `Transfer ${stringAmount} ${stringToken}\n` +
  `To: ${transfer.to.toLowerCase()}\n` +
  `Nonce: ${transfer.nonce}\n` +
  `Fee: ${stringFee} ${stringToken}\n` +
  `Account Id: ${this.accountId}`;

// For Withdraw:
const withdrawEthMessage =
  `Withdraw ${stringAmount} ${stringToken}\n` +
  `To: ${withdraw.ethAddress.toLowerCase()}\n` +
  `Nonce: ${withdraw.nonce}\n` +
  `Fee: ${stringFee} ${stringToken}\n` +
  `Account Id: ${this.accountId}`;

// For ChangePubKey (assuming it is a stand-alone transaction, for batch see details below):
const msgNonce = utils.hexlify(serializeNonce(nonce));
const msgAccId = utils.hexlify(serializeAccountId(accountId));
const pubKeyHashHex = pubKeyHash.replace('sync:', '').toLowerCase();
const changePubKeyEthMessage =
  `Register zkSync pubkey:\n\n` +
  `${pubKeyHashHex}\n` +
  `nonce: ${msgNonce}\n` +
  `account id: ${msgAccId}\n\n` +
  `Only sign this message for a trusted client!`;
```

> Note that since some Ethereum signers add a prefix \x19Ethereum Signed Message:\n${messageBytes.length} to the signed messages, it may be required to add this prefix manually if used signer doesn't do it automatically.

### Sending transaction batches

> Transactions batch is a set of transactions that should succeed all together. If one of the batch transactions fails, all the transactions in this batch will fail as well.

**Note on security**

> In the current form, transaction batches is a server-side abstraction. Successful execution is checked pre-circuit, and information about batch is not passed into the circuit. Thus, if this feature is being used to pay fees in a different token, it is recommended to set the fee payment transaction last (so that server even in theory will be unable to execute the last transaction, but ignore other ones). In the future, the batches will be enforced in the circuit in order to increase the overall security of this feature.

> Currently, **a batch** is guaranteed to be able to successfully process **a max of 50 transactions.**

> For transaction batch, fee doesn't have to be set in each individual transaction, the **only requirement is that sum of fees set in transactions must be equal or greater than the sum of fees for transactions** if they would have been sent individually.

> That is, using transaction batches it is possible to pay the fee for transaction using the token other than used for transfer. In order to do so, one can create a batch of two transactions:

1. Transfer to the recipient in token FOO with fee set to 0.
1. Transfer to the own account in token BAR (the token you want to pay the fee with) with amount set to 0, and fee set enough to cover two transfers.

> Server will check that sum of fees (0 in the first transaction and 2x expected fee in the second one) is enough to cover processing of two transfers and will execute the batch.

### Ethereum signature for batch

> For transaction batches there is no need to provide an Ethereum signature for each transaction in it, instead, it is possible to provide exactly one signature per batch.

> Message for the batch to be signed should be formed as follows:

```js
// Assuming that `transactions` variable holds an array of batch transactions, and
// `serializeTx(...)` encodes transaction into bytes as per zkSync protocol.

// Obtain concatenated byte representations of each transaction.
const bytes = concat(transactions.map((tx) => serializeTx(tx)));
// Calculate `keccak256` hash of this byte sequence.
const hash = ethers.utils.keccak256(bytes).slice(2);
// Decode it into a byte sequence.
const message = Uint8Array.from(Buffer.from(hash, 'hex'));
```

> Requirement for adding a prefix described above still holds.

> This obtained signature may be sent together with batch via corresponding JSON RPC method, and none of the batch transactions is required to have an Ethereum signature.

### 2-Factor Authentication

**Why 2-factor Authentication?**

> To ensure that the security of the users' zkSync accounts is equal to the security of their Ethereum wallets, the zkSync server requires both your layer 1 and layer 2 signatures when submitting a transaction.

> In some wallet clients that secure your zkSync layer 2 private key, you may choose to unbundle the two so that you can still access zkSync funds even if you lose your Ethereum private key.

> 2FA is enabled by default, but may be turned off by submitting such a request to our API.

## Reference

- [ZKSync official](https://zksync.io/)