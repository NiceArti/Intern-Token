// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20
{
    event Transfer(address indexed _from, address indexed _to, uint32 _value);
    event Approval(address indexed _owner, address indexed _spender, uint32 _value);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint32);
    function balanceOf(address _owner) external view returns (uint32 balance);
    function transfer(address _to, uint32 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint32 _value) external returns (bool success);
    function approve(address _spender, uint32 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint32);
}