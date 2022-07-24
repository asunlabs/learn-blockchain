import { ethers } from 'ethers'
import { createRequire } from 'module'
import dotenv from 'dotenv'

dotenv.config({
    path: './.env',
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
const PRICE_CONSUMER_ABI = require('./abi/PRICE_CONSUMER_KOVAN.json')
const PRICE_CONSUMER_KOVAN = '0x355bd08011db289dAb96d482C417683F8E41f37c'

const provider = new ethers.getDefaultProvider('kovan', {
    projectId: INFURA_PROJECT_ID,
    projectSecret: INFURA_PROJECT_SECRET,
})

const signer = new ethers.Wallet(ACCOUNT_KOVAN_PRIVATE_KEY, provider)
const priceConsumer = new ethers.Contract(PRICE_CONSUMER_KOVAN, PRICE_CONSUMER_ABI, provider)

const convertEth = async () => {
    const priceOracle = await priceConsumer.getLatestPrice()
    const converted = priceOracle / 1e8
    console.log(converted)
}

convertEth()
