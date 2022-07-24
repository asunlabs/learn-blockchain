// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

// Every computation is caculcated with a special type of unit, gas.
// Ethereum yellow paper explans that gas is deducted per every computation contract.
contract Gas {
    /**
     * Tx => update blockchain state by operation/computation
     * Tx fee = gas used * gas price
     * metadata sent with Tx
     * gas limit: max gas willing to spend for this Tx. Higher, more computations can be done.
     *      gas limit: set by transaction sender
     *      block gas limit: set by network, target size: 15 million gas, flexible size: up to 30 million gas
     * gas price: max ether willing to pay for 1 gas. Higher, tx processed faster.
     * usually gas price is automatically calculated in wallet and suggests it like 1) fast 2) normal 3) slow
     * gas left: a refunded gas amount after tx is done.
     */
    
    uint256 public i = 0;
    function simpleOperation() external pure returns(bytes32) {
        bytes memory name = abi.encodePacked("Jake Sung"); // gas deducted
        bytes32 hashedName = keccak256(name); // gas deducted
        return hashedName;
    }

    // In Remix, gas price is fixed in 1 wei. 

    function getGasRefund() external view returns(uint256) {
        return gasleft();
    }

    // remix will freeze if this executes.
    // During transaction execution, if gas rans out the state update would revert.
    // But you will still have to pay for the gas spent in the invalid tx.
    function forever() external {
        while(true) {
            i += 1;
        }
    }
}