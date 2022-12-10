import ethers from 'ethers'
import dotenv from 'dotenv'
import { createRequire } from 'module'
import { decodeLogs } from 'abi-decoder'
const require = createRequire(import.meta.url)
const TEST_TOKEN_MUMBAI = require('../abi/TEST_TOKEN_MUMBAI.json')

dotenv.config({
    path: '../.env',
})

const { ACCOUNT_MUMBAI_PRIVATE_KEY, TEST_MUMBAI_HTTP, TEST_MUMBAI_API_KEY, TEST_MUMBAI_WSS } = process.env

const abiDecoder = require('abi-decoder') // NodeJS

const provider = new ethers.providers.AlchemyProvider('maticmum', TEST_MUMBAI_API_KEY)

const mintTxHash = {
    success: '0x1791925ef9385281a9c822d7e25a3e04a302e985d3f9563f21897a997b4ab21b',
    failure: '0x3de31b431e7fd195bf1f71950f9e37894d26e0cf5c673f74238dddf8f1d7d4db',
}

/**
 *
 * @param {string} txHash
 * @param {string} state
 */
async function parseEventLog(txHash, state) {
    // const receipt = await ethers.providers.
    // ABIDecoder.decodeLogs()
    // decode logs from tx receipt
    abiDecoder.addABI(TEST_TOKEN_MUMBAI)

    console.log(`...parsing ${state} tx hash...`)
    const receipt = await provider.getTransactionReceipt(txHash)

    const { logs } = receipt

    // console.log({ logs })
    // console.log(logs[0].topics)
    // const { topics } = logs[0]
    // const { data } = logs[0]
    // const eventSig = topics[0]
    // console.log({ eventSig })
    // console.log({ data })

    /**
     * * decodedLogs
     * type: array
     * props
     * 1) name: event name
     * 2) events: []
     * 3) address: contract address
     */
    const decodedLogs = abiDecoder.decodeLogs(logs)

    // @dev decodedEvents has method parameters as array
    /**
     *
    [
        {
            name: 'from',
            type: 'address',
            value: '0x0000000000000000000000000000000000000000'
        },
        {
            name: 'to',
            type: 'address',
            value: '0xecab21327b6eba1fb0631dc9bbc5863b6b2be3e4'
        },
        { name: 'value', type: 'uint256', value: '2222' }
    ]
    */
    const decodedEvents = decodedLogs[0].events
    decodedEvents.forEach((params) => {
        console.log(`${params.name}: ${params.value}`)
    })
}

parseEventLog(mintTxHash.success, 'success')
    .then(() => process.exit(0))
    .catch((err) => process.exit(1))

// @dev failed transaction does not have event
// see here for more detail: https://github.com/asunlabs/learn-blockchain/issues/130
parseEventLog(mintTxHash.failure, 'failure')
    .then(() => process.exit(0))
    .catch((err) => process.exit(1))
