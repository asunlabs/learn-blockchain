import { BigNumber, ethers } from 'ethers'

// decimal and exponent
const DECIMAL = 1e18 // 1 * 10**18
const exponentialOperator = 10 ** 18
const MAX_NUMBER_JS = Number.MAX_SAFE_INTEGER

// good
const ether = BigNumber.from('1000000000000000000')

// bad
const etherString = '1000000000000000000'

console.log(DECIMAL === exponentialOperator)
console.log(ethers.utils.formatBytes32String('dog')) // to hex
console.log(ethers.utils.isHexString(ethers.utils.formatBytes32String('dog'))) // true
console.log(ethers.utils.formatEther(ether)) // 1 ether, safe
console.log(ethers.utils.formatEther(etherString)) // 1 ether, but not safe
console.log('parsed: ', ethers.utils.parseEther('1').toString())
console.log(ethers.utils.formatUnits(100000000000, 'ether'))

const byteString = '0x6a616b652073756e670000000000000000000000000000000000000000000000'
const stringString = 'jake sung'
console.log(ethers.utils.parseBytes32String(byteString))
console.log(ethers.utils.formatBytes32String(stringString))
console.log(ethers.utils.parseBytes32String(byteString) === stringString ? 'same value: bytes32 and string' : 'conversion failed')
