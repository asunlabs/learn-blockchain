// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyReentrancyGuard is ReentrancyGuard{
    constructor() ReentrancyGuard(){}

    // attach nonReentrant modifier to protect withdrawl hacking
    function withdraw() public nonReentrant {
        // some withdrawl logic here 
    }
}

contract Attacker { 
    // attempt to intercept withdrawl
}