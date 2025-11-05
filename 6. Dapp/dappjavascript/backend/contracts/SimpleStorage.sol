// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract SimpleStorage {
    uint256 private myNumber;

    function setMyNumber(uint256 _myNumber) external {
        myNumber = _myNumber;
    }

    function getMyNumber() external view returns (uint256) {
        return myNumber;
    }
}