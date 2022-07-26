import { ethers } from 'ethers'
import { createRequire } from 'module'
import dotenv from 'dotenv'

// FIX: load exported .env values undefined

dotenv.config({
    path: '../.env',
})
const {
    API_ETHERSCAN_KEY,
    API_COINMARKETCAP_KEY,
    API_PINATA_KEY,
    API_PINATA_SECRET,
    API_PINATA_JWT,
    INFURA_PROJECT_ID,
    INFURA_PROJECT_SECRET,
    TEST_ROPSTEN_URL,
    TEST_KOVAN_URL,
    TEST_RINKBY_URL,
    TEST_GOERLI_URL,
    MAIN_ETHEREUM_URL,
    ACCOUNT_ETHEREUM_PRIVATE_KEY,
    ACCOUNT_ROPSTEN_PRIVATE_KEY,
    ACCOUNT_KOVAN_PRIVATE_KEY,
    ACCOUNT_RINKEBY_PRIVATE_KEY,
} = process.env

const require = createRequire(import.meta.url)

const infuraSetup = {
    projectId: INFURA_PROJECT_ID,
    projectSecret: INFURA_PROJECT_SECRET,
}

const selectProvider = {
    ropsten: 'ropsten',
    kovan: 'kovan',
    rinkeby: 'rinkeby',
    // goerli: infuraSetup,
    mainnet: 'mainnet',
}

const selectPrivateKey = {
    ropsten: ACCOUNT_ROPSTEN_PRIVATE_KEY,
    kovan: ACCOUNT_KOVAN_PRIVATE_KEY,
    rinkeby: ACCOUNT_RINKEBY_PRIVATE_KEY,
    // goerli: infuraSetup,
    mainnet: ACCOUNT_ETHEREUM_PRIVATE_KEY,
}

console.log(selectPrivateKey.kovan)
export { require, infuraSetup, selectProvider, selectPrivateKey }
