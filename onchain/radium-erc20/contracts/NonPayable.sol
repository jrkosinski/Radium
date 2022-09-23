// SPDX-License-Identifier: ISC
pragma solidity ^0.8.4;

/**
 * @title Radium ERC20 Token MintStore
 * @author John R. Kosinski
 * 
 * @dev This is just FOR TESTING test cases in which payment fails (the contract can't 
 * be paid, it doesn't offer a payable method). Calling { tryWithdrawFunds } under the 
 * right conditions should trigger a failure (that's the test case). 
 */
contract NonPayable {
    error PaymentRefused();
    
    //refuse payment 
    receive() external payable {
        revert PaymentRefused();
    }
    
    /**
     * @dev This contract must be the owner of the MintStore, and MintStore should have 
     * funds in it; call this to attempt to have this contract withdraw funds. It should
     * fail. 
     * 
     * @param from Address of a MintStore contract (cast as IWithdrawable). 
     */
    function tryWithdrawFunds(address from) external {
        IWithdrawable store = IWithdrawable(from); 
        store.withdraw(1); 
    }
}

/**
 * @dev Just need the { withdraw } method of MintStore, for testing. 
 * Low-level call won't bubble the error back out, which is what I want. 
 */
interface IWithdrawable {
    function withdraw(uint256 amount) external; 
}