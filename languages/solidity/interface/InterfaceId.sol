// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IProvideId {
    event IndexedLog(address indexed caller);
}

contract InterfaceId is IProvideId {
    // non-constant function
    function getId() external returns (bytes4) {
        emit IndexedLog(msg.sender);
        return type(IProvideId).interfaceId;
    }

    
    function stringifyId() external returns(string memory){ 
        bytes4 id = this.getId();
        // address[] memory addressArray;

        // abi.encode(...arg): returns bytes memory
        // abi.encodePacked(...arg): returns bytes memory(byte array)
        return string(abi.encodePacked(id));
    }

    function checkMsgSender() external view returns(address) {
        return msg.sender;
    }

    function checkKeccak() external pure returns(bytes32) {
        return keccak256("Jake Sung");
    }

    function truncateBytes32() external pure returns(bytes4) {
        return bytes4(keccak256("not jake sung"));
    }

    function getBytes32() external pure returns(bytes32) {
        return bytes32("jake sung");
    }

    struct Person { 
        string name;
        uint8 age;
    }

    // TIP: Remix IDE takes an array for struct parameter.
    // e.g Person's attribute => you should enter like:  [name, age] in Remix
    function getCalldata(uint8[] calldata uptoTen, Person calldata) external pure returns (bytes4) {
        uint256 length = uptoTen.length;
        
        return msg.sig;
    }

}