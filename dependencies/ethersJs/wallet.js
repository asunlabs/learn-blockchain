import ethers from 'ethers'

const signer = ethers.Wallet.createRandom()
const addr = signer.address
const publicKey = signer.publicKey
const privateKey = signer.privateKey

console.table({ addr })
console.table({ publicKey })
console.table({ privateKey })
