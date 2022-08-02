// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyArray {
    uint256[] private arr1 ;
    uint256[] public arr2 = [1,2,3];
    uint256[3] public arr3 = [4,5,6];

    uint256 public arrayLength = arr2.length;

    function addOneElementToArray(uint256 newElement) public {
        arr2.push(newElement);
    }

    function deleteOneElementFromArray(uint256 deleteThis) public {
        delete arr2[deleteThis];
    }
}

contract DynamicArray {

    address immutable owner;
    uint256 size;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "only owner");
        _;
    }

    function setSize(uint256 _size) public onlyOwner  {
        size = _size;
    }

    /**
     * dynamic array size is set and updated by owner.
     * if the size is three, array will be initialized with [0,0,0]
     */
    /// @return uintArray value is as followings => 0:uint256[]: 0,0,0,0,0
    function generate() external view returns(uint256[] memory) {
        uint256[] memory uintArray = new uint256[](size); 
        return uintArray;
    }

    function getLength() external view returns(uint256) {
        return this.generate().length;
    }
}