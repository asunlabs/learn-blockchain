// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/*
call, delegatecall: encode data into bytes
decode: bytes into data
*/
contract EncodeDecode {
    struct MyStruct {
        string name;
        uint256[2] nums;
    }

    // calldata: where function arguments are stored
    // abi.encode: return bytes
    function encode(
        uint256 x,
        address addr,
        uint256[] calldata arr,
        MyStruct calldata myStruct
    ) external pure returns (bytes memory) {
        return abi.encode(x, addr, arr, myStruct);
    } // return value: 0x000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000d9145cce52d386f254917e481eb44e9943f39138000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000900000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000007700000000000000000000000000000000000000000000000000000000000000

    function decode(bytes calldata data)
        external
        pure
        returns (
            uint256 x,
            address addr,
            uint256[] memory arr, // can set calldata for return type
            MyStruct memory myStruct
        )
    {
        // abi.decode(encodedData, value1, value2 ...)
        // tuple destructuring
        (x, addr, arr, myStruct) = abi.decode(data, (uint256, address, uint256[], MyStruct));

        // keccak256: compute the Ethereum-SHA-3 (Keccak-256) hash of the (tightly packed) arguments
        // keccak256(x)

        // sha256: compute the SHA-256 hash of the (tightly packed) arguments
        // sha256(x)

        // sha: alias to keccak256, deprecated
        // sha3(x)
    }
}
