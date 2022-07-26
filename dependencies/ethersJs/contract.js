import { ethers } from 'ethers'
import { createRequire } from 'module'
import dotenv from 'dotenv'

dotenv.config()

// ============= ABI ============= //
const require = createRequire(import.meta.url)
const USDC_ROPSTEN_ABI = require('./abi/USDC_ROPSTEN.json')
const CHURU_ROPSTEN_ABI = require('./abi/CHURU_ROPSTEN.json')
const CURIOUS_PAWONEER_ABI = require('./abi/CURIOUS_PAWONEER.json')
const ALICE_ABI = require('./abi/ALICE_ROPSTEN.json')
const BRIAN_ABI = require('./abi/BRIAN_ROPSTEN.json')
const SMTIH_ABI = require('./abi/SMITH_ROPSTEN.json')
// ============= ABI ============= //

// ============= setup ============= //
const projectId = process.env.INFURA_PROJECT_ID
const projectSecret = process.env.INFURA_PROJECT_SECRET
const metamaskPrivateKey = process.env.ACCOUNT_ROPSTEN_PRIVATE_KEY
const provider = new ethers.getDefaultProvider('ropsten', {
    projectId,
    projectSecret,
})

const JAKE_ADDR = '0xEcAB21327B6EbA1FB0631Dc9bBc5863B6B2be3E4'
const infuraProvider = new ethers.providers.InfuraProvider('ropsten')
// create an EOA instance:
const jakeSigner = new ethers.Wallet(metamaskPrivateKey, provider)
// ============= setup ============= //

// ============= contract address ============= //
const USDC_ROPSTEN = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
const CHURU_ROPSTEN = '0x0f4d7069B9a58699D7c369F9ac97777fBDe4e8e4'
const CURIOUS_PAWONEER_ROPSTEN = '0x0D684a95D43169Dca01eBf6d78ac31079e6f6a31'
const ALICE = '0x42D160C647051F33B103EEf193604746c51D1480'
const BRIAN_ROPSTEN = '0x071e1DFdA83C3719E2a95337E653F50F5c21e4b1'
const SMITH_ROPSTEN = '0x530A7bE46D057fDf98466Be52635eCb514707D4B'
// ============= contract address ============= //

// ============= contract instance ============= //
const churu = new ethers.Contract(CHURU_ROPSTEN, CHURU_ROPSTEN_ABI, jakeSigner)
const curiousPawoneer = new ethers.Contract(CURIOUS_PAWONEER_ROPSTEN, CURIOUS_PAWONEER_ABI, jakeSigner)
const alice = new ethers.Contract(ALICE, ALICE_ABI, jakeSigner)
const brian = new ethers.Contract(BRIAN_ROPSTEN, BRIAN_ABI, jakeSigner)
const smith = new ethers.Contract(SMITH_ROPSTEN, SMTIH_ABI, jakeSigner)
// ============= contract instance ============= //

// console.log(jakeSigner)
// console.log(jakeSigner.address)
// console.log(jakeSigner.privateKey)

// WORKING: contract/ERC20 => Wallet/ERC20
const sendChuruToMetamask = async () => {
    const result = await churu.transfer(jakeSigner.address, 100000) // transfer churu from contract to signer jake
    console.log('tx hash: ', result.hash)
}

// sendChuruToMetamask()

// WORKING: contract/ERC721 => Wallet/ERC721
const sendCuriousPawoneerToMetamask = async () => {
    const result = await curiousPawoneer.mint(jakeSigner.address, 1)
    console.log('tx hash: ', result.hash)
}

// sendCuriousPawoneerToMetamask()

// WORKING: contract/ERC20 => contract/ERC20
const sendChuruToAlice = async () => {
    const result = await churu.transfer(alice.address, 100000)
    console.log('tx hash: ', result.hash)
}

// sendChuruToAlice()

const sendBrianToSmith = async () => {
    const result = await brian.safeMint(jakeSigner.address, 0)
    console.log('tx hash:', result.hash)
}

sendBrianToSmith()

// ===================== NOT WORKING: ERC721 not compatible with ERC20
const sendChuruToCuriousPawoneer = async () => {
    const result = await churu.transfer(curiousPawoneer.address, 100000)
    console.log('tx hash: ', result.hash)
}

// sendChuruToCuriousPawoneer()

// NOT WORKING: wallet/eth => contract/ERC20, but format is coffect
const sendEthToChuru = async () => {
    const res = await jakeSigner.sendTransaction({
        from: jakeSigner.address,
        to: churu.address,
        value: ethers.utils.parseEther('0.01'),
        gasLimit: 3000000,
        gasPrice: await jakeSigner.getGasPrice(),
    })
    console.log('tx hash:', res.hash)
}

// sendEthToChuru()
