import { NftSwap } from '@traderxyz/nft-swap-sdk'
import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { NftSwapV4, NftSwapV3 } from '@traderxyz/nft-swap-sdk'

dotenv.config()

const projectId = process.env.INFURA_PROJECT_ID
const projectSecret = process.env.INFURA_PROJECT_SECRET

const provider = new ethers.getDefaultProvider('ropsten', {
    projectId,
    projectSecret,
})

const chainId = 3

// const nftSwapV3 = new NftSwapV3(provider, signerForMaker, chainId)

const MY_NFT_A = {
    tokenAddress: '',
    tokenId: '0',
    type: 'ERC721',
}

const WETH = {
    tokenAddress: '',
    amount: '',
    type: 'ERC20',
}

const makerAddress = ''

// maker: build order
const privateKeyForMaker = process.env.ACCOUNT_ROPSTEN_PRIVATE_KEY
const signerForMaker = new ethers.Wallet(privateKeyForMaker, provider)

const nftSwapV4Maker = new NftSwapV4(provider, privateKeyForMaker, chainId)
await nftSwapV4Maker.approveTokenOrNftByAsset(MY_NFT_A, makerAddress)

const order = nftSwapV4Maker.buildOrder(MY_NFT_A, WETH, makerAddress)

const signedOrder = await nftSwapV4Maker.signOrder(order)

// taker:
const privateKeyForTaker = process.env.TAKER_PRIVATE_KEY
const signerForTaker = new ethers.Wallet(privateKeyForTaker, provider)
const takerAddress = ''
const nftSwapV4Taker = new NftSwapV4(provider, signerForTaker)

await nftSwapV4Taker.approveTokenOrNftByAsset(WETH, signerForTaker)

const fillTx = await nftSwapV4Taker.fillSignedOrder(signedOrder)
const fillTxReceipt = await nftSwapV4Taker.awaitTransactionHash(fillTx.hash)

console.log(fillTxReceipt.transactionHash)
