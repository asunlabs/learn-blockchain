import { NftSwap } from '@traderxyz/nft-swap-sdk'
import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const projectId = process.env.INFURA_PROJECT_ID
const projectSecret = process.env.INFURA_PROJECT_SECRET

const provider = new ethers.getDefaultProvider('ropsten', {
    projectId,
    projectSecret,
})

const privateKey = process.env.ACCOUNT_ROPSTEN_PRIVATE_KEY

const signer = new ethers.Wallet(privateKey, provider)
const nftSwap = new NftSwap(provider, signer, ethers.providers.getNetwork())
console.log(provider._network.chainId)
