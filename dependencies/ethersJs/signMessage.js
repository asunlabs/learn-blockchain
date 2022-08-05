import { ethers } from "ethers";
import dotenv from 'dotenv'
import chalk from 'chalk'

dotenv.config()

const  { ACCOUNT_GOERLI_PRIVATE_KEY, INFURA_PROJECT_SECRET,  INFURA_PROJECT_ID} = process.env

const provider = new ethers.getDefaultProvider('goerli', {
    INFURA_PROJECT_ID, 
    INFURA_PROJECT_SECRET
} )

const signer = new ethers.Wallet(ACCOUNT_GOERLI_PRIVATE_KEY, provider)

console.log(chalk.bgMagenta.bold("ethers wallet address === metamask public address? "),signer.address === "0x7AC00050e9DA6DE6307aeCc28286A2C4a3fa5cf7")

const string_message = "developerasun"
const hashed_message = ethers.utils.hashMessage(string_message)

console.log(chalk.bgMagenta.bold("message is hashed: "), hashed_message)

// if hashed message is a string, it MUST be converted to array first
// and then delivered to signer.signMessage
const arrayfied = ethers.utils.arrayify(hashed_message)
console.log(chalk.bgMagenta.bold("hash string must be arrayified before delivery: "), arrayfied)

/**
 * 
 * Message should be delivered in a different format when: 
 *  1) message is a string: await signer.signMessage(message)
 *  2) message is a hash string: ethers.utils.arrayify(message)
 * 
 * signer.signMessage
 *  This returns a Promise which resolves to the Raw Signature of message,
 *  which is 65 bytes v(1), r(32), s(32)
 * 
 */
const signedMessage = await signer.signMessage(arrayfied)
console.log(chalk.bgCyan.bold("signed message is: "), signedMessage)
console.log(chalk.bgCyan.bold("signed message length: "), signedMessage.length)

const nonce = await signer.getTransactionCount()

console.log(chalk.bgCyan.bold("signer's nonce is: "), nonce)