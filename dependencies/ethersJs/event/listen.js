import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { createRequire } from 'module'
import { Contract } from 'ethers'

dotenv.config({ path: '../.env' })

/**
 * contract being tested: https://mumbai.polygonscan.com/address/0x4B34585e661fDAB2653666a738824aCBB0d2Cb69
 */

const { TEST_MUMBAI_WSS } = process.env

const require = createRequire(import.meta.url)

const TEST_TOKEN_ADDR = '0x4B34585e661fDAB2653666a738824aCBB0d2Cb69'
const TEST_TOKEN_ABI = require('../abi/TEST_TOKEN_MUMBAI.json')
const provider = new ethers.providers.WebSocketProvider(TEST_MUMBAI_WSS, 'maticmum')

const contract = new Contract(TEST_TOKEN_ADDR, TEST_TOKEN_ABI, provider)

/**
 * @dev jsdoc for type helper
 * @param {string} txHash

 */
function mockResponse(txHash) {
    console.log('successful response for: ', txHash)
}

/**
 *
 * @param {string} txHash
 * @param {number} chainId
 */
async function getRevertReason(txHash, chainId) {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(`https://api.tenderly.co/api/v1/public-contract/${chainId}/tx/${txHash}`)

    const errReason = (await response.json()).error_message
    console.log({ errReason })
}

async function Listener() {
    // display start message in terminal for logging
    console.log('TransferListener started')

    // @dev contract.on only gets triggered for a successful transaction
    contract.on('Transfer', async (...params) => {
        console.log('================== TransferListener triggered ==================')

        // @dev params in event listener: (method param 1, 2, 3 ..., event object)
        const event = params[params.length - 1]
        // console.log({ event })

        const txHashInEvent = event.transactionHash
        // console.log('tx hash in event: ', txHashInEvent)

        /**
         * @dev txHashInEvent === txHashInReceipt => true
         * @dev await event.getTransactionReceipt(txHashInEvent) === await provider.getTransactionReceipt(txHashInEvent)
         */
        // @dev
        const receipt = await event.getTransactionReceipt(txHashInEvent)
        // const receipt = await provider.getTransactionReceipt(txHashInEvent)

        const transactionStatus = {
            success: 1,
            failure: 0,
        }

        /**
         * @dev receipt.byzantium: should be true to have a receipt.status props
         * @dev receipt.status: 1 for a successful transaction, 0 for a reverted transaction
         */
        if (receipt.byzantium === true && receipt.status === transactionStatus.success) {
            mockResponse(receipt.transactionHash)
        }
    })

    // @dev add second event listener
    console.log('second event listener started')
    contract.on('Approval', async (...params) => {
        console.log('================== ApprovalListener triggered ==================')
        const event = params[params.length - 1]
        const transactionHash = event.transactionHash
        console.log('TX hash for approval: ', transactionHash)

        const receipt = await event.getTransactionReceipt(transactionHash)

        console.log(receipt.status)
    })
}

Listener()
