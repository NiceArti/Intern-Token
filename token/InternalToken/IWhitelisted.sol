// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWhitelisted
{
    event AddToWhitelist(address indexed account);
    event RemoveFromWhitelist(address indexed account);
}