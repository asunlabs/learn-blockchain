// import * as Reason from 'eth-revert-reason'
import { createRequire } from 'module'
import { ethers } from 'ethers'
import dotenv from 'dotenv'
const require = createRequire(import.meta.url)
const getRevertReason = require('eth-revert-reason')
// const nodeFetch = require('node-fetch')

dotenv.config({ path: '../.env' })

const { MAIN_ETHEREUM_HTTP, TEST_MUMBAI_HTTP } = process.env

// * ABI needs to be an implementation one
const TEST_TOKEN_ABI = require('../abi/TEST_TOKEN_MUMBAI.json')

// * WSS RPC URL is used for blockchain event listener
const provider = new ethers.providers.JsonRpcProvider(MAIN_ETHEREUM_HTTP, 'mainnet')
const mumProvider = new ethers.providers.JsonRpcProvider(TEST_MUMBAI_HTTP, 'maticmum')

async function getReason() {
    // console.log((await mumProvider.getNetwork()).name)

    // eth-revert-reason dep: working for ethereum mainnet
    let txHash = '0x6ea1798a2d0d21db18d6e45ca00f230160b05f172f6022aa138a0b605831d740'
    let network = 'mainnet'
    let blockNumber = 9892243
    const reason = await getRevertReason(txHash, network, blockNumber, provider)
    console.log({ reason })

    // tenderly API: working for polygon testnet
    let txHash_ = '0x791c13481887b34d2ff6643c985f40a67c7dd024183d3c5c0a84591706206a7c'
    let network_ = 'maticmum'
    let blockNumber_ = 29483127

    console.log((await mumProvider.getNetwork()).chainId)

    const fetch = (await import('node-fetch')).default
    const response = await fetch(`https://api.tenderly.co/api/v1/public-contract/${(await mumProvider.getNetwork()).chainId}/tx/${txHash_}`)

    const errReason = (await response.json()).error_message
    console.log({ errReason })
}

getReason()
