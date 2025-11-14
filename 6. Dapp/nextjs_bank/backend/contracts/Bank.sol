// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

error CannotBeZero();
error NotEnoughFunds();
error TransferFailed();

contract Bank {
    struct Account {
        uint256 balance;
        uint256 lastDeposit;
    }

    mapping(address => Account) private accounts;

    event etherDeposited(address indexed account, uint256 amount);
    event etherWithdrawn(address indexed account, uint256 amount);

    /// @notice Allows the user to deposit Ether
    function deposit() external payable {
        require(msg.value > 0, CannotBeZero());
        accounts[msg.sender].balance += msg.value;
        accounts[msg.sender].lastDeposit = block.timestamp;
        emit etherDeposited(msg.sender, msg.value);
    }

    /// @notice Allows the user to withdraw Ether
    /// @param _amount The amount of Ether the user wants to withdraw
    function withdraw(uint256 _amount) external {
        require(_amount > 0, CannotBeZero());
        require(accounts[msg.sender].balance >= _amount, NotEnoughFunds());
        accounts[msg.sender].balance -= _amount;
        (bool received, ) = msg.sender.call{value: _amount}("");
        require(received, TransferFailed());
        emit etherWithdrawn(msg.sender, _amount);
    }

    /// @notice Get the balance of a user
    /// @param _user The user whose balance we want to retrieve
    /// @return The balance of the user
    function getBalanceOfUser(address _user) external view returns (uint256) {
        return accounts[_user].balance;
    }

    /// @notice Get the timestamp of the last deposit of a user
    /// @param _user The user whose last deposit timestamp we want to retrieve
    /// @return The timestamp of the last deposit of the user
    function getLastDepositTimestamp(
        address _user
    ) external view returns (uint256) {
        return accounts[_user].lastDeposit;
    }
}