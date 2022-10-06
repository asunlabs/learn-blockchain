// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IMyType {}

contract YourType {
    function getNumber() public pure returns (uint256) {
        return 5;
    }
}

contract MyType {
    function getContractName() public pure returns (string memory) {
        return type(MyType).name;
    }

    /// @dev type(MyType).creationCode throws a circular reference
    /**
     *  type(C).creationCode: Memory byte array that contains the creation bytecode of the contract. This can be used in inline assembly to build custom creation routines, especially by using the create2 opcode. This property can not be accessed in the contract itself or any derived contract. It causes the bytecode to be included in the bytecode of the call site and thus circular references like that are not possible.
     */
    function getCreationCode() public pure returns (bytes memory) {
        return type(YourType).creationCode;
    }

    /**
     * type(C).runtimeCode: Memory byte array that contains the runtime bytecode of the contract. This is the code that is usually deployed by the constructor of C. If C has a constructor that uses inline assembly, this might be different from the actually deployed bytecode. Also note that libraries modify their runtime bytecode at time of deployment to guard against regular calls. The same restrictions as with .creationCode also apply for this property.
     */
    function getRuntimeCode() public pure returns (bytes memory) {
        return type(YourType).runtimeCode;
    }

    function getInterfaceId() public pure returns (bytes4) {
        return type(IMyType).interfaceId;
    }
}
