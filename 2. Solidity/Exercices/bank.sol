// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Ownable {

    mapping(uint256 => uint256) deposits;
    uint256 depositNumber;
    uint256 time; // Quand l'admin va pouvoir retirer son argent
    // address immutable i_owner;

    // constructor() {
    //     i_owner = msg.sender;
    // }

    // modifier onlyOwner {
    //     require(msg.sender == i_owner);
    //     _;
    // }

    constructor() Ownable(msg.sender) {

    }

    function deposit() external payable onlyOwner {
        require(msg.value > 0, "Not enough funds provided");
        deposits[depositNumber] = msg.value;
        depositNumber=depositNumber+1;
        if(time == 0) {
            time = block.timestamp + 90 days;
        }
    }

    function withdraw() external onlyOwner {
        require(block.timestamp >= time, "Wait 3 months after the first deposit to withdraw");
        require(address(this).balance > 0, "No Ethers on the contract");
        (bool sent,) = payable(msg.sender).call{value: address(this).balance}("");
        require(sent, "An error occured");
    }



}