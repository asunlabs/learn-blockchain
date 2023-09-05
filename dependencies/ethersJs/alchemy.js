import dotenv from 'dotenv'
import { Network, Alchemy } from "alchemy-sdk";

dotenv.config()

const { ALCHEMY_ETH_MAINNET, ALCHEMY_MUMBAI } = process.env

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: ALCHEMY_MUMBAI, // Replace with your Alchemy API Key.
  network: Network.MATIC_MUMBAI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// Print owner's wallet address:
const ownerAddr = "0x7D5d9edDC3DAd91e5E18200EC3972CeCF988485f";
console.log("fetching NFTs for address:", ownerAddr);
console.log("...");


// Fetch metadata for a particular NFT:
console.log("fetching metadata for a test NFT...");
const response = await alchemy.nft.getNftMetadata(
  "0xa637FEAcdd2A811F31DCF2810fa63691c4632166",
  "0", 
  {refreshCache: true}
);

// await alchemy.nft.get

// Uncomment this line to see the full api response:
// console.log(response);

// Print some commonly used fields:
console.log({ response})
console.log("NFT name: ", response.title);
console.log("token type: ", response.tokenType);
console.log("tokenUri: ", response.tokenUri.gateway);
console.log("image url: ", response.rawMetadata.image);
console.log("time last updated: ", response.timeLastUpdated);
console.log("===");