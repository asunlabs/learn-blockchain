// SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;

/// @dev C.wrap, C.unwrap is introduced in Solidity ver 0.8.8
contract UserDefinedValue { 

    // syntax: type C is V
    // C.wrap(c) => type V
    // C.unwrap(v) => c
    type MyBytes28 is bytes28;
    type MyInt128 is int128;

    MyBytes28 private _userDefiendTypeValue = MyBytes28.wrap("test");
    MyInt128 private _myIntValue = MyInt128.wrap(33);

    function getCustomBytes28() external view returns(MyBytes28) {
        return _userDefiendTypeValue;
    }

    function toCustomBytes28(bytes28 _value) external pure returns(MyBytes28) {
        return MyBytes28.wrap(_value);
    }

    function toUnderlyingType(MyBytes28 _value) external pure returns(bytes28) {
        return MyBytes28.unwrap(_value);
    }
}