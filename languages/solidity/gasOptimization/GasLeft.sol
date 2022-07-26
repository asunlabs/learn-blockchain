// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
contract GasLeft {
    // The function gasleft was previously known as msg.gas, which was deprecated in version 0.4.21 and removed in version 0.5.0.
    // test 1: set gas limit 3,000,000 (Remix default) => deploy => gasleft: 2978818 => 21,182 gas used
    // test 2: set gas limit 50,000 => deploy => gasleft: 28818 => 21,182 gas used
    // test 3: set gas limit 21,000 => deploy => gasleft: revert with base fee exceeds gas limit => all gas used
    function getGasLeft() external view returns(uint256) {
        return gasleft();
    }
}