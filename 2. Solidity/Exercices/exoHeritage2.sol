// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

interface Deployed {
    
    function set (uint256 num) external;
    
    function get () external view returns (uint256);
}

contract Existing {
    
    Deployed dc;

 
    function attach(address _addr) public{
        dc = Deployed(_addr);
    }

    function getA() public  returns (uint result) {
        address addr = address(dc);
        addr.call{value: 1 ether, gas : 25000 }(abi.encodeWithSignature("set()", 42));
        return dc.get();

    }

    function setA(uint _val, address payable _addr) public returns (uint result){
        dc.set(_val);

        //(bool success, bytes memory data)= _addr.call{value: 1 ether }(abi.encodeWithSignature("get()"));
        //uint value = abi.decode(data, (uint));
        //require (success, "Failed to send Ether");

        return _val;
    }
    

}