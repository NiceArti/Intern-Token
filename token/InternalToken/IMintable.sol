// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMintable
{
    event Mint(address indexed zero_address, address indexed account, uint32 value);
    function mint(uint32 value) external;
}