// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWhitelisted.sol";

contract Whitelist is IWhitelisted
{
    mapping(address => bool) public whitelisted;

    function addToWhitelist(address account) public onlyWhitelisted
    {
        require(whitelisted[account] != true, "Whitelist: this account already in whitelist");
        require(account != address(0), "Whitelist: cannot add zero address");

        whitelisted[account] = true;
        emit AddToWhitelist(account);
    }

    function removeFromWhitelist(address account) public onlyWhitelisted
    {
        require(whitelisted[account] == true, "Whitelist: this account was not in whitelist");

        whitelisted[account] = false;       
        emit RemoveFromWhitelist(account);
    }

    modifier onlyWhitelisted()
    {
        require(whitelisted[msg.sender] == true, "INT: only whitelisted can do that!");
        _;
    }
}