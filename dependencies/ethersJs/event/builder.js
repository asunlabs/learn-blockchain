import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { createRequire } from 'module'
import { Contract } from 'ethers'
import USDC_ROPSTEN_ABI from '../abi/impl/USDC_ROPSTEN_IMPL.json' assert { type: 'json' }

dotenv.config({ path: '../.env' })

const { TEST_ROPSTEN_WSS } = process.env

// const require = createRequire(import.meta.url)

// * ABI needs to be an implementation one
// const USDC_ROPSTEN_ABI = require('../abi/impl/USDC_ROPSTEN_IMPL.json')

// * WSS RPC URL is used for blockchain event listener
const provider = new ethers.providers.WebSocketProvider(TEST_ROPSTEN_WSS, 'ropsten')
const USDC_ROPSTEN_ADDR = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'

class MyContract {
    address
    abi
    websocketProvider

    constructor(_address, _abi, _websocketProvider) {
        this.address = _address
        this.abi = _abi
        this.websocketProvider = _websocketProvider
    }
}

class MyContractBuilder {
    address
    abi
    websocketProvider

    constructor(_address, _abi, _websocketProvider) {
        this.address = _address
        this.abi = _abi
        this.websocketProvider = _websocketProvider
    }

    setNetworkInfo(_networkInfo) {
        this.netweorkInfo = _networkInfo
        return this // return this object again for method chain
    }

    setChainId(_chainId) {
        this.chainId = _chainId
        return this // return this object again for method chain
    }
}

// ! below lines works in terms of design pattern but throw websocket error

// prettier-ignore
const myContract1 = new MyContractBuilder(
    USDC_ROPSTEN_ADDR, 
    USDC_ROPSTEN_ABI, 
    provider)
    .setChainId(2)
    .setNetworkInfo('wow')

console.log(myContract1)

// prettier-ignore
const myContract2 = new MyContractBuilder(
    USDC_ROPSTEN_ADDR, 
    USDC_ROPSTEN_ABI, 
    provider)
    .setNetworkInfo('my-cool-network')

console.log(myContract2)
