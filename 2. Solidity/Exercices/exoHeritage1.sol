// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.26;

contract parent{
    uint internal sum;
    function setValue(uint _value) external {
        sum = _value;
    }
}


contract child is parent{

    function getValue() external view returns(uint) {
        return sum;
    }
    
}

contract caller {

    child cc = new child();

    function testInheritance(uint _value) public returns (uint) {
        cc.setValue(_value);
        return cc.getValue();
    }

    function testAddr()public view returns (address){
        return address(cc);
    }

}