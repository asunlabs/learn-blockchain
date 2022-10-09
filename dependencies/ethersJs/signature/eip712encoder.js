import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const { ACCOUNT_GOERLI_PRIVATE_KEY, INFURA_PROJECT_SECRET, INFURA_PROJECT_ID } = process.env

const provider = ethers.getDefaultProvider('goerli', {
    INFURA_PROJECT_ID,
    INFURA_PROJECT_SECRET,
})
/**
 * @dev ../node_modules/.bin/ts-node signTyped.ts
 * @dev TypedDataEncoder is used to compute encoded data used in EIP-712
 * * Signed data elements
 * 1) domain data(app related)
 * 2) type definition of data to sign
 * 3) data to sign
 */

const EIP712Encoder = ethers.utils._TypedDataEncoder

const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
}

const structPerson = 'Person(string name,address wallet)'

// The named list of all type definitions
const types = {
    Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
    ],
    Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
    ],
}

// The data to sign
const value = {
    from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
}

/**
 *     static encode(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): string {
        return hexConcat([
            "0x1901",
            TypedDataEncoder.hashDomain(domain),
            TypedDataEncoder.from(types).hash(value)
        ]);
    
 */
const encoded = EIP712Encoder.encode(domain, types, value) // '0x1901f2cee375fa42b42143804025fc449deafd50cc031ca257e0b194a650a912090fc52c0ee5d84264471806290a3f2c4cecfc5490626bf912d01f240d7a274b371e'

const signer = new ethers.Wallet(ACCOUNT_GOERLI_PRIVATE_KEY, provider)
const signature = await signer._signTypedData(domain, types, value)

console.log({ signature })

/**
 * @dev keccak256 value of EIP712Encoder.encode. 
 * returns bytes32 of encoded domain, types, value
 *     static hash(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): string {
        return keccak256(TypedDataEncoder.encode(domain, types, value));
    }
 */
const digestHash = EIP712Encoder.hash(domain, types, value)

const structName = 'Person'
const structTypes = {
    Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
    ],
}

const structValue = {
    name: 'Jake',
    wallet: signer.address,
}

/**
 * @dev hashStruct: struct name, struct types, struct value, returning a bytes32 string of the sturct
 */
const structHash = EIP712Encoder.hashStruct(structName, structTypes, structValue)
console.log({ structHash })

/**
 * @dev take a digestHash and signature
 * export function verifyTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>, signature: SignatureLike): string {
    return recoverAddress(_TypedDataEncoder.hash(domain, types, value), signature);
}
 */
const recoveredSigner = ethers.utils.verifyTypedData(domain, types, value, signature)
console.log(signer.address === recoveredSigner ? 'recovered' : 'invalid signature')

const { r, s, v } = ethers.utils.splitSignature(signature)
