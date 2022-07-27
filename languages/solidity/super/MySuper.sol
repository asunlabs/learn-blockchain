// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract InheritMe {
    function returnNumber() public virtual pure returns (int256) {
        return -5;
    }
}

/// @dev understanding super keyword in inheritance
/**
 *
 * Sometimes you want to extend a parent’s behavior, instead of outright changing it to something else.
 * This is where super comes in. The function in parent contract
 * should not be external
 *
 */
contract MySuper is InheritMe {
    function returnNumber() public override pure returns(int256) {
        return 5;
    }
    function useSuper() external pure returns(int256) {
        return super.returnNumber();
    }
}