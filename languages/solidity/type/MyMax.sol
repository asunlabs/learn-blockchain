// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MyMax {
    function _maxSupply() public view virtual returns (uint256) {
        return type(uint256).max;
    }
}
