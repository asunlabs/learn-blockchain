# Learning Geth essentials

## Getting Started with Geth

> The tutorial on this page assumes Geth and the associated developer tools have been installed successfully.

> This page provides step-by-step instructions covering the fundamentals of using Geth. This includes generating accounts, joining an Ethereum network, syncing the blockchain and sending ether between accounts. This tutorial also uses Clef. Clef is an account management tool external to Geth itself that allows users to sign transactions. It is developed and maintained by the Geth team and is intended to eventually replace the account management tool built in to Geth.

## Background 

> In order to use Ethereum, it is first necessary to generate an EOA (hereafter, “account”). This tutorial will guide the user through creating an account, funding it with ether and sending some to another address.

> Geth is an Ethereum client written in Go. This means **running Geth turns a computer into an Ethereum node**. Ethereum is a peer-to-peer network where information is shared directly between nodes rather than being managed by a central server. Nodes compete to generate new blocks of transactions to send to its peers because they are rewarded for doing so in **Ethereum’s native token, ether (ETH)**. On receiving a new block, each node checks that it is valid and adds it to their database. The sequence of discrete blocks is called a “blockchain”. 

> The information provided in each block is used by Geth to update its “state” - the ether balance of each account on Ethereum. There are two types of account: externally-owned accounts (EOAs) and contract accounts. Contract accounts execute contract code when they receive transactions. EOAs are accounts that users manage locally in order to sign and submit transactions. **Each EOA is a public-private key pair**, where _the public key is used to derive a unique address for the user_ and the private key is used to protect the account and securely sign messages

> There are several methods for generating accounts in Geth. This tutorial demonstrates how to **generate accounts using Clef**, as this is _considered best practice_, largely because it decouples the users’ key management from Geth, making it more modular and flexible. It can also be run from secure USB sticks or virtual machines, offering security benefits. For convenience, this tutorial will execute Clef on the same computer that will also run Geth, although more secure options are available (see here).

> _An account is a pair of keys (public and private)_. **Clef needs to know where to save these keys** to so that they can be retrieved later. This information is passed to Clef as an argument. This is achieved using the following command:

```shell
$clef newaccount --keystore geth-tutorial/keystore
```

> The specific function from Clef that generates new accounts is newaccount and it accepts a parameter, --keystore, that tells it where to store the newly generated keys. In this example the keystore location is a new directory that will be created automatically: geth-tutorial/keystore. Clef will return the following result in the terminal:

## Introduction to Clef

> Clef is a tool **for signing transactions and data** in a secure local environment. It is intended to become a more composable and secure replacement for Geth’s built-in account management. Clef decouples key management from Geth itself, meaning it can be used as an independent, standalone key management and signing application, or it can be integrated into Geth. This provides a more flexible modular tool compared to Geth’s account manager. 

> **Clef can be used safely in situations where access to Ethereum is via a remote and/or untrusted node because signing happens locally**, either manually or automatically using custom rulesets. The separation of Clef from the node itself enables it to run as a daemon on the same machine as the client software, on a secure usb-stick like USB armory, or even a separate VM in a QubesOS type setup.

### Installing and starting Clef

> Clef comes bundled with Geth and can be built along with Geth and the other bundled tools using:

```sh
# in Windows, you can install make with chocolatey
make all
```

> However, Clef is not bound to Geth and can be built on its own using:

```sh
make clef
```

> **Once built, Clef must be initialized**. This includes storing some data, some of which is sensitive (such as passwords, account data, signing rules etc). Initializing Clef takes that data and encrypts it using a user-defined password.

```sh
# initiation
clef init

# or just simply enter clef
clef
```

Once initiated with password, Clef generates a masterseed in local hard disk.

![clef-masterseed-path](https://user-images.githubusercontent.com/83855174/181705329-22a1bd34-cb46-451e-bca8-9f09a2f8392b.png)

### Security model

> One of the major benefits of Clef is that it is **decoupled from the client software**, meaning it can be used by users and dapps to **sign data and transactions in a secure, local environment** and **send the signed packet to an arbitrary Ethereum entry-point**, which might include, for example, an untrusted remote node.

> Alternatively, **Clef** can simply be used as a standalone, composable signer that can be **a backend component for decentralized applications**. This requires a secure architecture that separates cryptographic operations from user interactions and internal/external communication.

> The security model of Clef is as follows: **A self-contained binary controls all cryptographic operations** including encryption, decryption and storage of keystore files, and signing data and transactions.

> A well defined, deliberately **minimal “external” API** is used to communicate with the Clef binary - **Clef considers this external traffic to be UNTRUSTED**. This means Clef does not accept any credentials and does not recognize authority of requests received over this channel. Clef listens on http.addr:http.port or ipcpath - the same as Geth - and **expects messages to be formatted using the JSON-RPC 2.0 standard**. Some of the external API calls require some user interaction (manual approve/deny)- if it is not received responses can be delayed indefinitely.

> Clef communicates with the process that invoked the binary using stin/stout. The process invoking the binary is usually the **native console-based user interface (UI)** but there is also an API that enables communication with an external UI. This has to be enabled **using --stdio-ui at startup. This channel is considered TRUSTED** and is used to pass approvals and passwords between the user and Clef.

> **Clef does not store keys** - the user is responsible for securely storing and backing up keyfiles. Clef does store _account passwords in its encrypted vault_ if they are explicitly provided to Clef by the user to enable automatic account unlocking.

> The **external API** never handles any sensitive data directly, but it can be **used to request Clef to sign some data or a transaction**. It is the **internal API** that controls signing and triggers **requests for manual approval** (automatic approves actions that conform to attested rulesets) and passwords.

The general flow for **a basic transaction-signing operation using Clef** and an Ethereum node such as Geth is as follows:

![image](https://user-images.githubusercontent.com/83855174/181710883-308472a1-903e-445a-9917-55573505332d.png)

> In the case illustrated in the schematic above, Geth would be started with --signer <addr>:<port> and would relay requests to eth.sendTransaction. Text in mono font positioned along arrows shows the objects passed between each component.

> **Most users use Clef by manually approving transactions through the UI** as in the schematic above, but it is also possible to configure Clef to sign transactions without always prompting the user. This requires defining the precise conditions under which a transaction will be signed. _These conditions are known as Rules_ and they are small Javascript snippets that are attested by the user by injecting the snippet’s hash into Clef’s secure whitelist. 

> Clef is then started with the rule file, so that requests that satisfy the conditions in the whitelisted rule files are automatically signed. This is covered in detail on the Rules page.

### Basic usage

> Clef is started on the command line using the clef command. Clef can be **configured by providing flags and commands to clef on startup**. The full list of command line options is available below. Frequently used options include --keystore and --chainid which configure the path to an existing keystore and a network to connect to. These options default to $HOME/.ethereum/keystore and 1 (corresponding to Ethereum Mainnet) respectively. 

```
# default keystore path
C:\Users\nello\AppData\Local\Ethereum\keystore
```

> The following code snippet starts Clef, providing a custom path to an existing keystore and connecting to the Goerli testnet:

```sh
clef --keystore /my/keystore --chainid 5
```

> Requests requiring account access or signing now require explicit consent in this terminal. Activities such as sending transactions via a local Geth node’s attached Javascript console or RPC will now hang indefinitely, awaiting approval in this terminal.

Run clef gendoc command to check JSON RPC format.

```sh
clef gendoc
```

```md
## UI Client interface

These data types are defined in the channel between clef and the UI

### SignDataRequest

SignDataRequest contains information about a pending request to sign some data. The data to be signed can be of various types, defined by content-type. Clef has done most of the work in canonicalizing and making sense of the data, and it's up to the UI to presentthe user with the contents of the `message`

Example:
```json
{
  "content_type": "text/plain",
  "address": "0xDEADbEeF000000000000000000000000DeaDbeEf",
  "raw_data": "GUV0aGVyZXVtIFNpZ25lZCBNZXNzYWdlOgoxMWhlbGxvIHdvcmxk",
  "messages": [
    {
      "name": "message",
      "value": "\u0019Ethereum Signed Message:\n11hello world",
      "type": "text/plain"
    }
  ],
  "call_info": null,
  "hash": "0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68",
  "meta": {
    "remote": "localhost:9999",
    "local": "localhost:8545",
    "scheme": "http",
    "User-Agent": "Firefox 3.2",
    "Origin": "www.malicious.ru"
  }
}
```
### SignDataResponse - approve

Response to SignDataRequest

Example:
```json
{
  "approved": true
}
```
### SignDataResponse - deny

Response to SignDataRequest

Example:
```json
{
  "approved": false
}
```
### SignTxRequest

SignTxRequest contains information about a pending request to sign a transaction. Aside from the transaction itself, there is also a `call_info`-struct. That struct contains messages of various types, that the user should be informed of.

As in any request, it's important to consider that the `meta` info also contains untrusted data.

The `transaction` (on input into clef) can have either `data` or `input` -- if both are set, they must be identical, otherwise an error is generated. However, Clef will always use `data` when passing this struct on (if Clef does otherwise, please file a ticket)

Example:
```json
{
  "transaction": {
    "from": "0xDEADbEeF000000000000000000000000DeaDbeEf",
    "to": null,
    "gas": "0x3e8",
    "gasPrice": "0x5",
    "maxFeePerGas": null,
    "maxPriorityFeePerGas": null,
    "value": "0x6",
    "nonce": "0x1",
    "data": "0x01020304"
  },
  "call_info": [
    {
      "type": "Warning",
      "message": "Something looks odd, show this message as a warning"
    },
    {
      "type": "Info",
      "message": "User should see this as well"
    }
  ],
  "meta": {
    "remote": "localhost:9999",
    "local": "localhost:8545",
    "scheme": "http",
    "User-Agent": "Firefox 3.2",
    "Origin": "www.malicious.ru"
  }
}
```
### SignTxResponse - approve

Response to request to sign a transaction. This response needs to contain the `transaction`, because the UI is free to make modifications to the transaction.

Example:
```json
{
  "transaction": {
    "from": "0xDEADbEeF000000000000000000000000DeaDbeEf",
    "to": null,
    "gas": "0x3e8",
    "gasPrice": "0x5",
    "maxFeePerGas": null,
    "maxPriorityFeePerGas": null,
    "value": "0x6",
    "nonce": "0x4",
    "data": "0x04030201"
  },
  "approved": true
}
```
### SignTxResponse - deny

Response to SignTxRequest. When denying a request, there's no need to provide the transaction in return

Example:
```json
{
  "transaction": {
    "from": "0x",
    "to": null,
    "gas": "0x0",
    "gasPrice": null,
    "maxFeePerGas": null,
    "maxPriorityFeePerGas": null,
    "value": "0x0",
    "nonce": "0x0",
    "data": null
  },
  "approved": false
}
```
### OnApproved - SignTransactionResult

SignTransactionResult is used in the call `clef` -> `OnApprovedTx(result)`

This occurs _after_ successful completion of the entire signing procedure, but right before the signed transaction is passed to the external caller. This method (and data) can be used by the UI to signal to the user that the transaction was signed, but it is primarily useful for ruleset implementations.

A ruleset that implements a rate limitation needs to know what transactions are sent out to the external interface. By hooking into this methods, the ruleset can maintain track of that count.

**OBS:** Note that if an attacker can restore your `clef` data to a previous point in time (e.g through a backup), the attacker can reset such windows, even if he/she is unable to decrypt the content.

The `OnApproved` method cannot be responded to, it's purely informative

Example:
```json
{
  "raw": "0xf85d640101948a8eafb1cf62bfbeb1741769dae1a9dd47996192018026a0716bd90515acb1e68e5ac5867aa11a1e65399c3349d479f5fb698554ebc6f293a04e8a4ebfff434e971e0ef12c5bf3a881b06fd04fc3f8b8a7291fb67a26a1d4ed",
  "tx": {
    "type": "0x0",
    "nonce": "0x64",
    "gasPrice": "0x1",
    "maxPriorityFeePerGas": null,
    "maxFeePerGas": null,
    "gas": "0x1",
    "value": "0x1",
    "input": "0x",
    "v": "0x26",
    "r": "0x716bd90515acb1e68e5ac5867aa11a1e65399c3349d479f5fb698554ebc6f293",
    "s": "0x4e8a4ebfff434e971e0ef12c5bf3a881b06fd04fc3f8b8a7291fb67a26a1d4ed",
    "to": "0x8a8eafb1cf62bfbeb1741769dae1a9dd47996192",
    "hash": "0x662f6d772692dd692f1b5e8baa77a9ff95bbd909362df3fc3d301aafebde5441"
  }
}
```
### UserInputRequest

Sent when clef needs the user to provide data. If 'password' is true, the input field should be treated accordingly (echo-free)

Example:
```json
{
  "title": "The title here",
  "prompt": "The question to ask the user",
  "isPassword": true
}
```
### UserInputResponse

Response to UserInputRequest

Example:
```json
{
  "text": "The textual response from user"
}
```
### ListRequest

Sent when a request has been made to list addresses. The UI is provided with the full `account`s, including local directory names. Note: this information is not passed back to the external caller, who only sees the `address`es.

Example:
```json
{
  "accounts": [
    {
      "address": "0xdeadbeef000000000000000000000000deadbeef",
      "url": "keystore:///path/to/keyfile/a"
    },
    {
      "address": "0x1111111122222222222233333333334444444444",
      "url": "keystore:///path/to/keyfile/b"
    }
  ],
  "meta": {
    "remote": "localhost:9999",
    "local": "localhost:8545",
    "scheme": "http",
    "User-Agent": "Firefox 3.2",
    "Origin": "www.malicious.ru"
  }
}
```
### ListResponse

Response to list request. The response contains a list of all addresses to show to the caller. Note: the UI is free to respond with any address the caller, regardless of whether it exists or not

Example:
```json
{
  "accounts": [
    {
      "address": "0x0000000000000000000000000000000000000000",
      "url": ".. ignored .."
    },
    {
      "address": "0xffffffffffffffffffffffffffffffffffffffff",
      "url": ""
    }
  ]
}
```

### Summary

> Clef is an external key management and signer tool that comes bundled with Geth but can either be **used as a backend account manager and signer** for Geth or as a completely separate standalone application. Being modular and composable it can be used as a component in decentralized applications or to sign data and transactions in untrusted environments. Clef is **intended to eventually replace Geth’s built-in account management tools**.


## Reference

- https://geth.ethereum.org/docs/getting-started