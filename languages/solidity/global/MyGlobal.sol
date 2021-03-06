// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.15;

/// @dev Playing around with global variables in Solidity
contract MyGlobal {
    /// @return
    function getTimestamp() external view returns (uint256) {
        return block.timestamp;
    }

    function getCoinbase() external view returns (address) {
        return block.coinbase;
    }

    function getBlockGasLimit() external view returns (uint256) {
        return block.gaslimit;
    }

    function getBlocknumber() external view returns (uint256) {
        return block.number;
    }

    function getBlockhash() external view returns (bytes32) {
        return blockhash(this.getBlocknumber());
    }

    function getDifficulty() external view returns (uint256) {
        return block.difficulty;
    }

    function getAddedTimestamp(uint256 _time) external view returns (uint256) {
        return block.timestamp + _time;
    }

    function getTimestampWithUnit() external view returns (uint256) {
        return block.timestamp + 1 minutes;
    }

    function getOneMinutes() external pure returns (uint256) {
        return 1 minutes; // returns 60
    }

    /// @return 3600, which is 60 seconds * 60
    function getOneHours() external pure returns (uint256) {
        return 1 hours;
    }

    /// @return 86400, which is 60 seconds * 60 * 24
    function getOneDays() external pure returns (uint256) {
        return 1 days;
    }
}
