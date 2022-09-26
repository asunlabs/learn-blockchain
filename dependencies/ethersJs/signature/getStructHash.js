import { ethers } from 'ethers'
import dotenv from 'dotenv'
import chalk from 'chalk'

dotenv.config({ path: '../.env' })

const { ACCOUNT_GOERLI_PRIVATE_KEY, INFURA_PROJECT_SECRET, INFURA_PROJECT_ID } = process.env

const provider = new ethers.getDefaultProvider('goerli', {
    INFURA_PROJECT_ID,
    INFURA_PROJECT_SECRET,
})

const signer = new ethers.Wallet(ACCOUNT_GOERLI_PRIVATE_KEY, provider)

const oneEther = ethers.utils.parseEther('1')
const nonce = await signer.getTransactionCount()

const _message = {
    sender: signer.address,
    value: oneEther,
    nonce: nonce,
}

// 1) solidity struct => javascript object
// 2) object => string => uint8Array => bytes32(non-packed encoding for hash)
// in Solidity: keccak(abi.encode(struct instance))
const message = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(_message)))
console.log({ message })

// adds ethereum prefix to struct hash
const toEthSignedMessageHash = ethers.utils.hashMessage(message)
console.log({ toEthSignedMessageHash })

// ! arrayify the prefixed message before sign message. if the toEthSignedMessageHash is string type,
// ! need to be arrayfied first
const digest = ethers.utils.arrayify(toEthSignedMessageHash)
console.log({ digest })

// get signature
const signature = await signer.signMessage(digest)

// 0x09624f86f7fc7dbf4b7621d217efb122c4a9474bca4a5412d39d24acb5a8710e7a8aca6df2e20259547674eba6b8133f4fb035a2e1a2b9793f0e754bdfe4a3f51b
console.log('signature', signature)

// verify signature
// console.log(ethers.utils.recoverAddress(digest, signature))
console.log(chalk.bgMagenta('recovered address: '), ethers.utils.verifyMessage(digest, signature))
console.log(chalk.bgCyan('signer address: '), signer.address)

const recoveredSigner = ethers.utils.verifyMessage(digest, signature)
console.log(recoveredSigner === signer.address ? chalk.bgGreen('recover success') : chalk.bgRed('recover failed'))
