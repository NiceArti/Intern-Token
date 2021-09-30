// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract ERC20 is IERC20
{
    string private _name;
    string private _symbol;
    uint32 private _totalSupply;

    uint32 constant MAX = 2**32 - 1;
    uint32 constant MIN = 0;


    mapping(address => uint32) balances;
    mapping(address => mapping (address => uint32)) allowed;


    //constructor
    constructor(uint32 totalSupply_)
    {
        _totalSupply = totalSupply_;
        balances[msg.sender] = _totalSupply;
    }

    //methods    
    function name() public virtual override view returns (string memory) {}
    function symbol() public virtual override view returns (string memory) {}
    function decimals() public virtual override view returns (uint8) { return 0; }
    function totalSupply() public virtual override view returns (uint32) 
    {
        return _totalSupply; 
    }   
    function balanceOf(address owner) public virtual override view returns (uint32) { return balances[owner]; }

    function transfer(address to, uint32 value) public virtual override returns (bool)
    {
        // require(to != address(0), "ERC20: transfert to the zero address");
        require(value <= balances[msg.sender], "ERC20: value is too big");
        
        balances[msg.sender] -= value;
        balances[to] += value;
        
        emit Transfer(msg.sender, to, value);
        
        return true;
    }
    function transferFrom(address from, address to, uint32 value) public virtual override returns (bool)
    {
        require(to != address(0), "ERC20: transfer to the zero address");
        require(from != address(0), "ERC20: transfer from the zero address");
        require(from != to, "ERC20: you cannot send to the same address");
        require(value <= balances[from], "ERC20: value is too big");
        require(value <= allowed[from][msg.sender], "ERC20: current account has no rights to transfer from owner's account");
        
        balances[from] -= value;
        allowed[from][msg.sender] -= value;
        balances[to] += value;
        
        emit Transfer(from, to, value);
    
        return true;
    }

    function approve(address spender, uint32 value) public virtual override returns (bool)
    {
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function allowance(address owner, address spender) public virtual override view returns (uint32)
    {
        return allowed[owner][spender];
    }
}