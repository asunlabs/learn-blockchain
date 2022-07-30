// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

contract MyMsgSig is ERC20PresetFixedSupply {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) ERC20PresetFixedSupply(name, symbol, initialSupply, owner) {}

    function mint() external {
        _mint(msg.sender, 100);
    }

    function getCoinbase() external view returns (address) {
        return block.coinbase;
    }

    function getERC20InterfaceId() external pure returns (bytes4) {
        return type(IERC20).interfaceId;
    }

    /// @return function selector == msg.sig, 0xd58a4f36
    function testSelectorAndMsgSig() external pure returns (bytes4) {
        bytes4 selector = this.testSelectorAndMsgSig.selector;
        bool isSameId = selector == msg.sig ? true : false;
        require(isSameId, "not same identifier");
        return msg.sig;
    }

    /// @dev msg.sig == function.selector == bytes4(keccak(string signature))
    function compareSelector() external pure returns (bool) {
        bytes4 fromKeccak = bytes4(keccak256(bytes("testSelectorAndMsgSig()")));
        bytes4 fromSelector = this.testSelectorAndMsgSig.selector;
        return fromSelector == fromKeccak ? true : false;
    }

    /// @dev extension funcSig: ccf989f0
    /// @return msg.sig: 0xccf989f0
    function compareSigWithExtension() external pure returns (bytes4) {
        return msg.sig;
    }
}
