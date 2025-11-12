// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract SimpleStorage {
    uint256 private myNumber;

    event NumberChanged(address indexed by, uint256 number);

    function setMyNumber(uint256 _myNumber) external {
        myNumber = _myNumber;
        emit NumberChanged(msg.sender, _myNumber);
    }

    function getMyNumber() external view returns (uint256) {
        return myNumber;
    }
}