import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { createRequire } from 'module'
import { Contract } from 'ethers'

dotenv.config({ path: '../.env' })

const { TEST_MUMBAI_WSS } = process.env

const require = createRequire(import.meta.url)

// * ABI needs to be an implementation one
const TEST_TOKEN_ABI = require('../abi/TEST_TOKEN_MUMBAI.json')

// * WSS RPC URL is used for blockchain event listener
const provider = new ethers.providers.WebSocketProvider(TEST_MUMBAI_WSS, 'maticmum')

const TEST_TOKEN_ADDR = '0x4B34585e661fDAB2653666a738824aCBB0d2Cb69'

const contract = new Contract(TEST_TOKEN_ADDR, TEST_TOKEN_ABI, provider)

/**
 * @dev jsdoc for type helper
 * @param {string} txHash

 */
function mockResponse(txHash) {
    console.log('successful response for: ', txHash)
}

async function TransferListener() {
    // display start message in terminal for logging
    console.log('Listener started')

    // when tx happens, it logs the event
    contract.on('Transfer', async (from, to, value, event) => {
        console.log('================== TransferListener triggered ==================')
        console.log({
            from,
            to,
            value,
        })

        const txHashInEvent = event.transactionHash
        console.log({ txHashInEvent })

        const receipt = await provider.getTransactionReceipt(txHashInEvent)
        console.log({ receipt })

        const txHashInReceipt = receipt.transactionHash
        console.log({ txHashInReceipt })

        // txHashInEvent === txHashInReceipt => true
        console.log(txHashInEvent === txHashInReceipt ? 'txHashInEvent === txHashInReceipt' : 'txHashInEvent !== txHashInReceipt')

        console.log('is byzantium forked blockchain? ', receipt.byzantium)
        console.log('is block mined?: ', receipt.status)

        const transactionStatus = {
            success: 1,
            failure: 0,
        }

        if (receipt.byzantium === true && receipt.status === transactionStatus.success) {
            mockResponse(txHashInEvent)
        } else {
            throw new Error('No byzantimu-forked network or receipt failed')
        }
    })
}

TransferListener()
