import ethers from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const { ACCOUNT_ETHERS_ADDR, ACCOUNT_ETHERS_PUB, ACCOUNT_ETHERS_PK } = process.env

// the created account is universal for network(mainnet, testnet)
// see here for detail: https://stackoverflow.com/questions/70607964/create-random-wallet-with-connection-to-a-specific-provider-via-ethers-js
const wallet = ethers.Wallet.createRandom()

/**
 * * Wallet class props
 * _isSigner bool
 * _signingKey Function
 * address string
 * _mnemonic Function
 * provider null
 */
console.log({ wallet })

const addr = wallet.address
const mnemonic = wallet.mnemonic.phrase
const provider = wallet.provider
const publicKey = wallet.publicKey
const privateKey = wallet.privateKey

console.log({ addr })
console.log({ publicKey })
console.log({ privateKey })
console.log({ provider })
console.log({ mnemonic })
