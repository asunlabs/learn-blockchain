import ethers from 'ethers'

const descriptionHash = ethers.utils.id("Proposal #1: Give Jake a tons of tokens")

console.log(descriptionHash)

// * note that getContractAt is a hardhat's extended ethers
// const dummyAddress = "address-here"
// const governanceToken = await ethers.getContractAt('ERC20', dummyAddress)

// // const transferCalldata = token.interface.encodeFunctionData(‘transfer’, [teamAddress, grantAmount]);
// governanceToken.interface.encodeFunctionData('myFunc')