// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MyCallback {
    constructor() {
        _balance[msg.sender] = 999;
    }

    uint256 private value;
    bytes public callbackCalldata;
    mapping(address => uint256) private _balance;

    function callback(address user) public returns (uint256 diff) {
        uint256 FIXED_EXPENSE = 100;
        callbackCalldata = msg.data;
        return _balance[user] -= FIXED_EXPENSE;
    }

    /// @dev if parent is private, callback should be internal
    /// @dev if parent is public, callback should be external
    function useCallback(function(address) external returns (uint256) cb) public {
        uint256 diff = cb(msg.sender);
        value = diff + 100;
    }
}
