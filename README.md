# john.kosinski

## Code 
- [ERC20 Contract](onchain/radium-erc20/) - The Solidity contract code 
- [Admin Console](offchain/radmin/) - Allows contract owner to perform admin functions on contract
[Public Buy Page](offchain/radium-buypage/) - Allows public users to buy 

## Deliverables 
- [Public Buy Page online](http://3.92.137.191:3000/)
- [ERC20 Contract on Rinkeby](https://rinkeby.etherscan.io/address/0x1849C697F244F316936949cAC7F6e41EDa7f8d36#code)
- [MintStore Contract on Rinkeby](https://rinkeby.etherscan.io/address/0xCbb14401e1B5b44707f39f3D45a5Fbccf5e44718#code)
- [Demo](https://youtu.be/Iojo6GykoBY) 
- [Demo Director's Cut](https://youtu.be/eHVWI-LsBNA)

## Requirements 
### Task: Smart Contract - Ethereum Tokens ("Radium")

Estimated time/effort: 10-20 hours

Expected delivery time: 7 days

Task scope and expectations
- The purpose of this task is to build a functional real-life application with all listed
requirements.
- What we want to see is how you will implement some real-life functionalities by paying
attention to details and following good development practices.
- We want to see you understand how to set up a proper project infrastructure, show
knowledge of simple problem solving, and knowledge of using your preferred
frameworks and libraries.
- Instead of spending a lot of time on providing a custom UI, please rather ensure the
functionality is properly done.

## Task details
Create a smart contract for a new ERC20 token called Radium (RAD). The contract needs to
be deployed to testnet before the interview.
The token will have the following characteristics:
- An initial total supply of 10,000,000.
- A buying cost of 0.01 ETH per RAD.
- The owner can burn all tokens at any time.
- The owner can mint an arbitrary amount of tokens at any time.
- The owner can transfer tokens from one address to another.
- The owner can specify and modify a list of eligible receivers. Once bought by users,
tokens can be transferred only to those addresses.
- Whatever parameters are not defined in the task are left for you to decide on your
own while making sure they benefit the contract's architecture.
