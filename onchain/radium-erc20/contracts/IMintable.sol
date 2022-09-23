// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title Radium ERC20 Token MintStore
 * @author John R. Kosinski
 * 
 * Interface for a thing that can be minted. Allows the Radium contract to be loosely coupled 
 * from the selling/minting functionality. 
 */
interface IMintable {
    
    /**
     * @dev See {IERC20-mint}.
     */
    function mint(address to, uint256 amount) external; 
}