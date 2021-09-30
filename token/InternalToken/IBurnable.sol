// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBurnable
{
    event Burn(address indexed account, address indexed zero_address, uint32 value);
    function burn(uint32 value) external;
}