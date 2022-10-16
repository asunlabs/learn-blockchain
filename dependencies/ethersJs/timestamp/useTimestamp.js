import 'ethers'
import { Contract, ethers, Wallet } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

const projectId = process.env.INFURA_PROJECT_ID
const projectSecret = process.env.INFURA_PROJECT_SECRET

// default provider is recommended to use. connected to as many as backend services
const defaultProvider = new ethers.getDefaultProvider('goerli', {
    projectId,
    projectSecret,
})

// individual provider
const provider = new ethers.providers.InfuraProvider('goerli')

// arguments
async function useTimestamp() {
    let timestamp = ''

    try {
        const blockNumber = await provider.getBlockNumber()
        const block = await provider.getBlock(blockNumber)
        timestamp = block.timestamp
    } catch (error) {
        console.error(error)
    }

    return { timestamp }
}

function convertUnixToDate(timestamp) {
    const constant = 1000
    const localDateString = new Date(timestamp * constant).toLocaleString()
    const yyyymmdd = new Date(timestamp * constant).toISOString().slice(0, 10)

    return { localDateString, yyyymmdd }
}

const _timestampAt = 1665931440

const { timestamp } = await useTimestamp()
console.log({ timestamp })

const timestampToDate = convertUnixToDate(timestamp)
console.log({ timestampToDate })

const timestampAt = convertUnixToDate(_timestampAt)
console.log({ timestampAt })
