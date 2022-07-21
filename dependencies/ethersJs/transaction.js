import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

// One of the useful classes that Ethers.js provides is a Wallet,
// which represents a regular Ethereum address that you can use to store and send Ether.
const { INFURA_PROJECT_ID, INFURA_PROJECT_SECRET, ACCOUNT_ROPSTEN_PRIVATE_KEY } = process.env

const provider = new ethers.getDefaultProvider('ropsten', {
    projectId: INFURA_PROJECT_ID,
    projectSecret: INFURA_PROJECT_SECRET,
})

// console.log('PK', ethers.Wallet.createRandom().privateKey) // create a private key
const privateKey = ACCOUNT_ROPSTEN_PRIVATE_KEY
const signer = new ethers.Wallet(privateKey, provider)
const DUMMY_ROPSTEN = '0xCf26396BA08e7d7Ef8F5edEf7705938AF06aE25e'

const transactionObject = {
    to: DUMMY_ROPSTEN,
    value: ethers.utils.parseEther('0.01'), // (ether) value
    gasLimit: 21000, // default 21000 for sending ether
    chainId: 3,
    // nonce: 1
    // maxPriorityFeePerGas: parseInt(ethers.utils.parseUnits('5', 'gwei')),
    // maxFeePerGas: ethers.utils.parseUnits('20', 'gwei').toString(), // base gas fee + maxPriorityFeePerGas
}

class TransactionManager {
    static signer = new ethers.Wallet(privateKey, provider)
    constructor(_transaction) {
        this.transaction = _transaction
    }
    async sendWithEthers() {
        const result = await TransactionManager.signer.sendTransaction(this.transaction)
        console.log('tx hash: ', result.hash)
    }
    async sendWithEtherscan() {
        // send with etherscan API: pass the raw transaction hash to the "eth_sendRawTransaction" endpoint
        // With the signed raw transaction, we can now pass it to the "eth_sendRawTransaction"
        // endpoint to be broadcasted to the Ethereum network.
        // eth_sendRawTransaction: Submits a pre-signed transaction for broadcast to the Ethereum network.
        const rawTransaction = await signer.signTransaction(this.transaction).then(ethers.utils.serializeTransaction(this.transaction))
        let gethProxy = await fetch(
            `https://api-ropsten.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=${rawTransaction}&apikey=YourApiKeyToken`
        )
        let response = await gethProxy.json()
    }
}

const myTransaction = new TransactionManager(transactionObject)
myTransaction
    .sendWithEthers()
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
