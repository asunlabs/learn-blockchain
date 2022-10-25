// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MyABI {
    uint256 public value = 0;
    string public senderName = "";

    bytes public encodedData;
    bytes public decodedData;

    // 1. encode =====(data)=====> bytes
    // 2. bytes =====(hashing)=====> bytes32

    function encodeData(uint256 _value, string memory _senderName) public returns (bytes memory) {
        encodedData = abi.encode(_value, _senderName);
        return encodedData;
    }

    /**
     * @dev abi.decode(data, (type 1, type 2, ...))
     * @dev abi.decode(bytes memory encodedData, (...)) returns (...): 
     ABI-decodes the given data, while the types are given in parentheses 
     as second argument. 

     Example: (uint a, uint[2] memory b, bytes memory c) 
        = abi.decode(data, (uint, uint[2], bytes))

     * @dev params in calldata cannot be modified
     */
    function decodeData(bytes calldata _data) public pure returns (uint256, string memory) {
        (uint256 decodedValue, string memory decodedName) = abi.decode(_data, (uint256, string));
        return (decodedValue, decodedName);
    }

    function encodedAndKeccak256(uint256 _value, string memory _senderName) public returns (bytes32) {
        return keccak256(encodeData(_value, _senderName));
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}

contract MyLowLevel {
    /**
      @dev abi.encodeWithSelector(bytes4 selector, ...) returns (bytes memory):
        ABI-encodes the given arguments starting from the second 
        and prepends the given four-byte selector

      note that abi.decode is paired with abi.encode. if your bytes input is coming from 
        different encoding methods such as abi.encodeWithSelector and abi.encodeWithSignature,
        the decode would not work.
     */
    function callWithEncodeWithSelector(uint256 _value, string memory _senderName) public pure returns (bytes memory) {
        bytes memory data = abi.encodeWithSelector(MyABI.encodeData.selector, _value, _senderName);

        return data; // 0x42a6e6720000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000046a616b6500000000000000000000000000000000000000000000000000000000
    }

    function decodeTheData(bytes calldata data) public pure returns (uint256, string memory) {
        (uint256 val, string memory senderName) = abi.decode(data, (uint256, string));

        return (val, senderName);
    }

    function compareEncodeAndEncodeWithSelector() public pure returns (bool) {
        bytes
            memory encodeWithSelectorReturnValue = "0x42a6e6720000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000046a616b6500000000000000000000000000000000000000000000000000000000";
        bytes
            memory encodeReturnValue = "0x0000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000046a616b6500000000000000000000000000000000000000000000000000000000";

        return
            encodeReturnValue.length == encodeWithSelectorReturnValue.length
                ? keccak256(encodeReturnValue) == keccak256(encodeWithSelectorReturnValue) ? true : false
                : false;
    }
}
