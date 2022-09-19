import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { createRequire } from 'module'
import { Contract } from 'ethers'

dotenv.config({ path: '../.env' })

const { TEST_ROPSTEN_WSS } = process.env

const require = createRequire(import.meta.url)

// * ABI needs to be an implementation one
const USDC_ROPSTEN_ABI = require('../abi/impl/USDC_ROPSTEN_IMPL.json')

// * WSS RPC URL is used for blockchain event listener
const provider = new ethers.providers.WebSocketProvider(TEST_ROPSTEN_WSS, 'ropsten')
const USDC_ROPSTEN_ADDR = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'

const contract = new Contract(USDC_ROPSTEN_ADDR, USDC_ROPSTEN_ABI, provider)

async function TransferListener() {
    console.log(contract.filters.Transfer())

    // when tx happens, it logs the event
    contract.on('Transfer', (from, to, value, event) => {
        let info = {
            from,
            to,
            value: ethers.utils.formatUnits(value, 6),
            data: event,
        }
        console.log('================== TransferListener triggered ==================')
        console.log(JSON.stringify(info, null, 4))
    })

    const event = contract.filters.Transfer()
    const filter = {
        fromBlock: -3,
        toBlock: 'latest',
        topics: event.topics,
    }
    console.log(await provider.getLogs(filter))
}

TransferListener()
