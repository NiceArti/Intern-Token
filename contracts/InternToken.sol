// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "../token/ERC20.sol";
import "../token/InternalToken/IBurnable.sol";
import "../token/InternalToken/IMintable.sol";
import "../token/InternalToken/IWhitelisted.sol";

contract InternToken is ERC20, IBurnable, IMintable, IWhitelisted
{
    string private _name = "Intern token";
    string private _symbol = "INT";
    uint32 private _totalSupply = 1000000000;

    mapping(address => bool) public whitelisted;

    constructor(string memory name, string memory symbol, uint32 totalSupply) ERC20(_name, _symbol, _totalSupply){}



    function burn(address account, uint32 value) internal 
    {
        require(account != address(0), "INT: your tokens are burned");
        require(value <= balances[account], "INT: value is too bigs");

        emit Transfer(account, address(0), value);
        emit Burn(account, address(0), value);
    }



    function mint(address account, uint32 value) internal
    {
        require(account != address(0), "INT: your tokens are burned");
        require(totalSupply() <= MAX, "INT: token value is overfrow");
        require(totalSupply() >= MIN, "INT: token value cannot be negative");

        balances[account] += value;

        emit Transfer(address(0), account, value);
        emit Mint(address(0), account, value);
    }


    function addToWhitelist(address account) internal onlyWhitelisted
    {
        whitelisted[account] = true;
        emit AddToWhitelist(account);
    }

    function removeFromWhitelist(address account) internal onlyWhitelisted
    {
        whitelisted[account] = false;       
        emit RemoveFromWhitelist(account);
    }

    modifier onlyWhitelisted()
    {
        require(whitelisted[msg.sender] == true, "INT: only owner can do that!");
        _;
    }
}