import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const { ACCOUNT_GOERLI_PRIVATE_KEY, INFURA_PROJECT_SECRET, INFURA_PROJECT_ID } = process.env

const provider = new ethers.getDefaultProvider('goerli', {
    INFURA_PROJECT_ID,
    INFURA_PROJECT_SECRET,
})

/**
 * * signer.signMessage
 * This returns a Promise which resolves to the Raw Signature of message(65 bytes v(1), r(32), s(32)).
 * A signed message is prefixed with "\x19Ethereum Signed Message:\n" and the length of the message,
 * using the hashMessage method, so that it is EIP-191 compliant. If recovering the address in Solidity,
 * this prefix will be required to create a matching hash.
 * Take a look at hashMessage.ts for more code detail.
 */

/**
 * * Caution
 * If message is a string, it is treated as a string and converted to its representation in UTF8 bytes.
 * ! If and only if a message is a Bytes will it be treated as binary data.
 * For example, the string "0x1234" is 6 characters long (and in this case 6 bytes long). This is not equivalent to the array [ 0x12, 0x34 ], which is 2 bytes long.
 * A common case is to sign a hash. In this case,
 * ! if the hash is a string, it must be converted to an array first, using the arrayify utility function.
 */

const signer = new ethers.Wallet(ACCOUNT_GOERLI_PRIVATE_KEY, provider)

const _message = {
    nonce: await signer.getTransactionCount(),
    sender: '0x123',
    value: ethers.utils.parseEther('1'),
}

// use message and signature values with Solidity ECDSA library
// to verify signature on-chain
const message = JSON.stringify(_message)

/// @dev ethersjs adds '\x19Ethereum Signed Message:\n' prefix for message hashing.
const hashed_message = ethers.utils.hashMessage('jake') // hashed data in Solidity

console.log({ hashed_message })

// ! if hashed message is a hash string, it MUST be converted to array first. And then delivered to signer.signMessage
const arrayfied = ethers.utils.arrayify(hashed_message)

const signature = await signer.signMessage(arrayfied) // bytes memory signature in Solidity

console.log({ signature })

// for more detail:https://github.com/ethers-io/ethers.js/issues/447
const recoveredAddress = ethers.utils.verifyMessage(arrayfied, signature)
console.log({ recoveredAddress })

const actualAddress = signer.address

console.log(recoveredAddress === actualAddress ? 'recover success' : 'recover failed')
