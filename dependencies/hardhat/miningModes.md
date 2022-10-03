# Mining modes in Hardhat

> Hardhat Network can be configured to automine blocks, immediately upon receiving each transaction, or it can be configured for interval mining, where a new block is mined periodically, incorporating as many pending transactions as possible.

> You can use one of these modes, both or neither. By default, only the automine mode is enabled.

> When automine is disabled, every sent transaction is added to the mempool, which contains all the transactions that could be mined in the future. By default, Hardhat Network's mempool follows the same rules as Geth. This means, among other things, that `transactions are prioritized by fees` paid to the miner (and then by arrival time), and that invalid transactions are dropped. In addition to the default mempool behavior, an alternative FIFO behavior is also available.

> When automine is disabled, pending transactions can be queried via the `eth_getBlockByNumber` _RPC method_ (with "pending" as the block number argument), they can be removed using the `hardhat_dropTransaction` RPC method, and they can be replaced by submitting a new transaction with the same nonce but with a 10+% increase in fees paid to the miner.

> If neither mining mode is enabled, no new blocks will be mined, but you can `manually mine new blocks using the evm_mine` _RPC method_. This will generate a new block that will include as many pending transactions as possible.

## Mempool behavior

> When automine is disabled, every sent transaction is added to the mempool, which contains all the transactions that could be mined in the future. By default, Hardhat Network's mempool follows the same rules as Geth. This means, among other things, that:

1. `Transactions with a higher gas price are included first`
1. If two transactions can be included and both are offering the miner the same total fees, the one that was `received first is included first`
1. If a transaction is `invalid` (for example, its nonce is lower than the nonce of the address that sent it), `the transaction is dropped`.

> You can get the list of pending transactions that will be included in the next block by using the "pending" block tag:

```js
const pendingBlock = await network.provider.send('eth_getBlockByNumber', ['pending', false])
```

## Mining transactions in FIFO order

> The way Hardhat Network's mempool orders transactions is customizable. By default, they are prioritized following Geth's rules, but you can enable a FIFO behavior instead, which ensures that transactions are added to blocks in the same order they are sent, and which is useful to recreate blocks from other networks.

> You can enable the FIFO behavior in your config with:

```js
networks: {
  hardhat: {
    mining: {
      mempool: {
        order: 'fifo'
      }
    }
  }
}
```

## Removing and replacing transactions

> Transactions in the mempool can be removed using the
> dropTransaction network helper:

```js
const txHash = '0xabc...'
await helpers.dropTransaction(txHash)
```

> You can also replace a transaction by sending a new one with the same nonce as the one that it's already in the mempool but with a higher gas price. Keep in mind that, like in Geth, for this to work the new gas/fees prices have to be at least 10% higher than the gas price of the current transaction.

## Configuring Mining Modes

> You can configure the mining behavior under your Hardhat Network settings:

```js
networks: {
  hardhat: {
    mining: {
      auto: false,
      interval: 5000 // new block per 5 seconds
    }
  }
}
```

> In this example, automining is disabled and interval mining is set so that a new block is generated every 5 seconds. You can also configure interval mining to generate a new block after a random delay:

```js
networks: {
  hardhat: {
    mining: {
      auto: false,
      interval: [3000, 6000]
    }
  }
}
```

> In this case, a new block will be mined after a random delay of between 3 and 6 seconds. For example, the first block could be mined after 4 seconds, the second block 5.5 seconds after that, and so on.

**Manual mining**

> You can disable both mining modes like this:

```js
networks: {
  hardhat: {
    mining: {
      auto: false,
      interval: 0
    }
  }
}
```

> This means that no new blocks will be mined by the Hardhat Network, but you can manually mine new blocks using the evm_mine RPC method. This will generate a new block that will include as many pending transactions as possible.

**Transaction ordering**

> Hardhat Network can sort mempool transactions in two different ways. How they are sorted will alter which transactions from the mempool get included in the next block, and in which order.

> The first ordering mode, called `"priority"`, mimics `Geth`'s behavior. This means that it prioritizes transactions based on the fees paid to the miner. This is the default.

> The second ordering mode, called "fifo", keeps the mempool transactions sorted in the order they arrive.

> You can change the ordering mode with:

```js
networks: {
  hardhat: {
    mining: {
      mempool: {
        order: 'fifo'
      }
    }
  }
}
```

### Using RPC methods

> You can change the mining behavior at runtime using two RPC methods: `evm_setAutomine` and `evm_setIntervalMining`. For example, to disable automining:

```js
await network.provider.send('evm_setAutomine', [false])
```

> And to enable interval mining

```js
await network.provider.send('evm_setIntervalMining', [5000])
```

## Reference

- [Hardhat - Mining Modes](https://hardhat.org/hardhat-network/docs/explanation/mining-modes#mining-transactions-in-fifo-order)
- [Hardhat - Configuring Mining Modes](https://hardhat.org/hardhat-network/docs/reference#mining-modes)
