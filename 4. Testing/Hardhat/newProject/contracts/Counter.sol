// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Counter {
  uint public x;

  mapping(address => uint) public balances;

  event Increment(uint by);

  constructor(){
    balances[msg.sender] = 100;
  }

  function inc() public {
    require( x < 2, "pas trop haut");
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }
}
