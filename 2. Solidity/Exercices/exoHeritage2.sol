// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.26;

interface Deployed {
    
    function set (uint256 num) external;
    
    function get () external view returns (uint256);
}

contract Existing {
    
    Deployed dc;

    function attach(address _addr) public{
        dc = Deployed(_addr);
    }

    function getA() public view returns (uint result) {
        return dc.get();
    }

    function setA(uint _val) public returns (uint result){
        dc.set(_val);
        return _val;
    }
    
}