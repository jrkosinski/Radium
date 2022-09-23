# Test Coverage (solidity-coverage) 

![coverage](coverage.png) 

### Version
---
- solidity-coverage: v0.7.22

### Instrumenting for coverage...
---

- Radium.sol
- IMintable.sol
- MintStore.sol
- NonPayable.sol

### Compilation:
---

Compiled 10 Solidity files successfully

### Network Info
---
- HardhatEVM: v2.11.1
- network:    hardhat


```
  Radium: Burning
    Initial State
      ✔ initial balances
    Burning from Specific Addresses
      ✔ owner can burn own tokens (44ms)
      ✔ owner can burn another's tokens (47ms)
      ✔ owner can't burn more than total owned by self (71ms)
      ✔ owner can't burn more than total owned by another
      ✔ cannot burn to zero address
    BurnAll
      ✔ owner can burn entire supply at once (51ms)
      ✔ burnAll clears allowances (125ms)
    Burning Permissions
      ✔ owner can burn
      ✔ owner can burn all
      ✔ non-owner cannot burn
      ✔ non-owner cannot burn all
      ✔ can recover state after burnAll (147ms)
    Burning Events
      ✔ burning emits Transfer
      ✔ burning all emits BurnAll

  Radium: Designated Minter
    Set DesignatedMinter Permissions
      ✔ owner can set designated minter
      ✔ non-owner cannot set designated minter
      ✔ designated minter can mint (44ms)
    Events
      ✔ setDesignatedMinter emits DesignatedMinterSet
      ✔ setDesignatedMinter doesn't emit if set with duplicate

  Radium: Initial Conditions
    Initial State
      ✔ initial balances
      ✔ security
      ✔ metadata
      ✔ designated minter

  Radium: Introspection (ERC-165)
    Supports Interfaces
      ✔ supports correct interfaces: IERC20
      ✔ supports correct interfaces: IERC20Metadata
      ✔ supports correct interfaces: IERC165
      ✔ doesn't support incorrect interfaces

  Radium: Mint Store
    Initial State
      ✔ initial property values
    Buy Tokens
      ✔ whitelisted user can purchase (63ms)
      ✔ non-whitelisted user can purchase (49ms)
      ✔ user can't buy tokens if price is insufficient
      ✔ buying won't work if store is not set as designated minter
    Withdraw
      ✔ owner can withdraw funds (46ms)
      ✔ non-owner cannot withdraw funds
      ✔ cannot withdraw more than balance (44ms)
      ✔ failure to withdraw (94ms)
    Events
      ✔ withdrawing emits Withdrawal (42ms)
      ✔ purchasing emits TokenPurchase (59ms)

  Radium: Minting
    Basic Minting
      ✔ owner can mint to self (39ms)
      ✔ owner can mint to another address
      ✔ cannot mint to zero address
    Minting Permissions
      ✔ owner can mint
      ✔ non-owner cannot mint
    Total Minted
      ✔ totalMinted increments (56ms)
      ✔ totalMinted does not clear on burnAll (73ms)
    Minting Events
      ✔ minting emits transfer

  Radium: Ownable
    Owner Permissions
      ✔ owner can transfer ownership (58ms)
      ✔ owner can renounce ownership
      ✔ non-owner cannot transfer ownership
      ✔ non-owner cannot renounce ownership

  Radium: Owner Transferring
    Initial State
      ✔ Initial balances
    Simple Transfer
      ✔ owner can transfer to non-owner
      ✔ non-owner can transfer to owner
    Administrative Transfer
      ✔ owner has implicit allowance for any amount (48ms)
      ✔ users do not have implicit allowance
      ✔ owner transfers between two parties without explicit approval (44ms)
      ✔ owner transfers from user to self without explicit approval (43ms)
      ✔ transfer cannot exceed user balance
      ✔ when ownership changes, default allowances also change (65ms)
      ✔ cannot transfer from zero address
      ✔ cannot transfer to zero address
      ✔ cannot transfer to non-whitelisted address (54ms)
    Events
      ✔ transfer event fires on transferFrom

  Radium: Pausable
    Initial State
      ✔ initial value
    Permissions
      ✔ owner can pause
      ✔ owner can unpause
      ✔ non-owner cannot pause
      ✔ non-owner cannot unpause
      ✔ cannot pause when paused
      ✔ cannot unpause when not paused
    Paused Behavior
      ✔ cannot mint when paused
      ✔ cannot transfer when paused
      ✔ cannot approve when paused
      ✔ cannot transferFrom when paused
      ✔ cannot add to whitelist when paused
      ✔ cannot remove from whitelist when paused
      ✔ cannot burn when paused
      ✔ cannot burn all when paused
      ✔ cannot set designated minter when paused
    Events
      ✔ pausing emits Paused
      ✔ unpausing emits Unpaused

  Radium: User to User Transferring
    Initial State
      ✔ Initial balances
    Simple Transfer
      ✔ non-owner can transfer tokens
      ✔ non-owner double transfer (59ms)
      ✔ cannot transfer more than balance
      ✔ cannot transfer to zero address
    Approve and Transfer
      Approve Single
        ✔ non-owner can approve a spender
        ✔ non-owner can approve and transfer (63ms)
        ✔ non-owner can approve and transfer to a third user (73ms)
        ✔ non-owner can cannot approve and double transfer (69ms)
        ✔ spender can spend partial allowance (131ms)
        ✔ spending cannot exceed allowance (43ms)
        ✔ non-owner cannot transfer without approval
        ✔ cannot approve to zero address
    Events
      ✔ transfer event fires on transfer
      ✔ approve event fires on approve
      ✔ transfer event fires on transferFrom (40ms)

  Radium: Whitelist
    Initial State
      ✔ initial whitelist is empty
      ✔ owner is always whitelisted by default
    Managing Whitelist
      ✔ owner can add to whitelist
      ✔ non-owner cannot add to whitelist
      ✔ owner can remove from whitelist (41ms)
      ✔ non-owner cannot remove from whitelist
      ✔ double-add user to whitelist (48ms)
      ✔ double-remove user from whitelist (55ms)
    Buying and Minting
      ✔ non-whitelisted address can purchase
      ✔ whitelisted address can purchase
    Transferring
      ✔ non-whitelisted address can transfer to whitelisted recipient
      ✔ non-whitelisted address cannot transfer to non-whitelisted recipient
      ✔ whitelisted address can transfer to whitelisted recipient
      ✔ whitelisted address cannot transfer to non-whitelisted recipient
      ✔ non-whitelisted address can approve whitelisted recipient
      ✔ non-whitelisted address can approve non-whitelisted recipient
      ✔ whitelisted address can approve whitelisted recipient
      ✔ whitelisted address can approve non-whitelisted recipient
      ✔ non-whitelisted address can transferFrom to whitelisted recipient (48ms)
      ✔ non-whitelisted address cannot transferFrom to non-whitelisted recipient
      ✔ whitelisted address can transferFrom to whitelisted recipient (50ms)
      ✔ whitelisted address cannot transferFrom to non-whitelisted recipient (41ms)
    Ownershsip
      ✔ transferring ownership automatically transfers whitelist status
      ✔ cannot remove owner from whitelist
    Events
      ✔ addWhitelist emits AddToWhitelist
      ✔ addWhitelist does not emit AddToWhitelist if duplicate
      ✔ removeWhitelist does not emit RemoveFromWhitelist if redundant


  125 passing (20s)

-----------------|----------|----------|----------|----------|----------------|
File             |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------|----------|----------|----------|----------|----------------|
 contracts/      |      100 |    97.06 |      100 |      100 |                |
  Radium.sol     |      100 |    96.43 |      100 |      100 |                |
  IMintable.sol  |      100 |      100 |      100 |      100 |                |
  MintStore.sol  |      100 |      100 |      100 |      100 |                |
  NonPayable.sol |      100 |      100 |      100 |      100 |                |
-----------------|----------|----------|----------|----------|----------------|
All files        |      100 |    97.06 |      100 |      100 |                |
-----------------|----------|----------|----------|----------|----------------|
```