import 'ethers'
import { BigNumber, Contract, ethers, Wallet } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

const projectId = process.env.INFURA_PROJECT_ID
const projectSecret = process.env.INFURA_PROJECT_SECRET

// default provider is recommended to use. connected to as many as backend services
const defaultProvider = new ethers.getDefaultProvider('ropsten', {
    projectId,
    projectSecret,
})

// individual provider
const provider = new ethers.providers.InfuraProvider('ropsten')

// signer
const jakeSigner = new ethers.Wallet(process.env.ACCOUNT_ROPSTEN_PRIVATE_KEY, provider)
console.log(jakeSigner.address)

console.log(await jakeSigner.getGasPrice()) // hex
console.log(parseInt(await jakeSigner.getGasPrice())) // number
console.log((await jakeSigner.getGasPrice()).toString())

const currentGasPrice = await jakeSigner.getGasPrice()
console.log(ethers.utils.hexlify(parseInt(currentGasPrice)))

console.log(ethers.utils.formatUnits(await jakeSigner.getGasPrice(), 'gwei'))

// getGasPrice is a legacy
console.log(BigNumber.from(await provider.getGasPrice()).toBigInt())

console.log(await provider.getFeeData())
// console.log(ethers.utils.formatUnits(await provider.getFeeData(), 'ether'))
