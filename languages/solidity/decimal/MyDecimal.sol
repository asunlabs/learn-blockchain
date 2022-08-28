// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyDecimal {
    using SafeMath for uint256;

    function round() public pure returns (bool, uint256) {
        uint256 myNum = 1234;
        return myNum.tryDiv(1e3); // expected 1, actual 1
    }
}
