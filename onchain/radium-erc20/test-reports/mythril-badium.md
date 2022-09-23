### Issue 1: Multiple Calls in a Single Transaction 
```
SWC ID: 113
Severity: Low
Contract: Radium
Function name: allowance(address,address)
PC address: 3966
Estimated Gas Usage: 3444 - 73039
Multiple calls are executed in the same transaction.
This call is executed following another call within the same transaction. 
It is possible that the call never gets executed if a prior call fails permanently. 
This might be caused intentionally by a malicious callee. 
If possible, refactor the code such that each transaction only executes one external call or make sure that all callees 
can be trusted (i.e. they’re part of your own codebase).
--------------------
In file: Radium.sol:336

this.balanceOf(approver)

--------------------
Initial State:

Account: [CREATOR], balance: 0x80003, nonce:0, storage:{}
Account: [ATTACKER], balance: 0x0, nonce:0, storage:{}

Transaction Sequence:

Caller: [CREATOR], calldata: , value: 0x0
Caller: [SOMEGUY], function: allowance(address,address), txdata: 0xdd62ed3e00000000000000000000000002000000000000080004000a0000000000000080000000000000000000000000affeaffeaffeaffeaffeaffeaffeaffeaffeaffe, value: 0x0
```
#### ACKNOWLEDGED: 
- the second call is read-only
- if the second call is never executed, no ill effects should be observed 


### Issue 2: Multiple Calls in a Single Transaction  
```
==== Multiple Calls in a Single Transaction ====
SWC ID: 113
Severity: Low
Contract: Radium
Function name: transferFrom(address,address,uint256)
PC address: 3966
Estimated Gas Usage: 30232 - 163271
Multiple calls are executed in the same transaction.
This call is executed following another call within the same transaction. 
It is possible that the call never gets executed if a prior call fails permanently. 
This might be caused intentionally by a malicious callee. 
If possible, refactor the code such that each transaction only executes one external call or make sure that all 
callees can be trusted (i.e. they’re part of your own codebase).
--------------------
In file: Radium.sol:336

this.balanceOf(approver)

--------------------
Initial State:

Account: [CREATOR], balance: 0x2200000000804001, nonce:0, storage:{}
Account: [ATTACKER], balance: 0x0, nonce:0, storage:{}

Transaction Sequence:

Caller: [CREATOR], calldata: , value: 0x0
Caller: [CREATOR], function: transferFrom(address,address,uint256), txdata: 0x23b872dd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000affeaffeaffeaffeaffeaffeaffeaffeaffeaffe0000000000000000000000000000000000000000000000000000000000000000, value: 0x0
```
#### ACKNOWLEDGED: 
- the second call is read-only
- if the second call is never executed, no ill effects should be observed 