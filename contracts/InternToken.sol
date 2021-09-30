// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "../token/ERC20.sol";
import "../token/InternalToken/IBurnable.sol";
import "../token/InternalToken/IMintable.sol";
import "../token/InternalToken/IWhitelisted.sol";
import "../token/InternalToken/Whitelist.sol";

contract InternToken is ERC20, Whitelist, IBurnable, IMintable
{
    string private _name;
    string private _symbol;
    uint32 private _totalSupply;

    constructor(uint32 totalSupply_) ERC20(_totalSupply)
    {
        whitelisted[msg.sender] = true;

        _totalSupply = totalSupply_;
        balances[msg.sender] = _totalSupply;

        _name = "Intern Token";
        _symbol = "INT";
    }


    function name() public view override returns (string memory)
    {
        return _name;
    }

    function symbol() public view override returns (string memory)
    {
        return _symbol;
    }

    function totalSupply() public override view returns (uint32) 
    {
        return _totalSupply; 
    }

    function burn(uint32 value) public override
    {
        _burn(msg.sender, value);
    }

    function mint(uint32 value) public override
    {
        _mint(msg.sender, value);
    }







    function _burn(address account, uint32 value) internal
    {
        require(account != address(0), "INT: your tokens are burned");
        require(value <= balances[account], "INT: value is too bigs");

        transfer(address(0), value);
        _totalSupply -= value;

        emit Transfer(msg.sender, address(0), value);
        emit Burn(msg.sender, address(0), value);
    }



    function _mint(address account, uint32 value) internal
    {
        require(account != address(0), "INT: your tokens are burned");
        require(totalSupply() <= MAX, "INT: token value is overfrow");
        require(totalSupply() >= MIN, "INT: token value cannot be negative");

        balances[account] += value;
        _totalSupply += value;

        emit Mint(address(0), account, value);
    }
}