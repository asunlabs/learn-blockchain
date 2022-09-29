import { ethers } from "ethers";
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const { ACCOUNT_GOERLI_PRIVATE_KEY, INFURA_PROJECT_SECRET, INFURA_PROJECT_ID } = process.env

const provider = new ethers.getDefaultProvider('goerli', {
    INFURA_PROJECT_ID,
    INFURA_PROJECT_SECRET,
})


const message = { 
    name: 'jake', 
    contents: 'jake sends 100 dollar to sally'
}
const signer = new ethers.Wallet(ACCOUNT_GOERLI_PRIVATE_KEY, provider)
const hash = ethers.utils.hashMessage(JSON.stringify(message))
const digest = ethers.utils.arrayify(hash)


/**
 * export interface Signature {
    r: string;

    s: string;
    _vs: string,

    recoveryParam: number;
    v: number;

    yParityAndS: string
    compact: string;
}
 */
const signature = await signer.signMessage(digest)
const joined_signature = ethers.utils.joinSignature(signature)

// why split signature ?
const { v, r, s } = ethers.utils.splitSignature(signature)

console.log( {v})
console.log( {r})
console.log( {s})

