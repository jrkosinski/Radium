const ContractApi = require('../contracts/contractApi');
const testAddresses = require('../contracts/testAddresses');
const abi = require('../contracts/abi');

//execute a contract API method after preparation, returns return value if any
async function execContract(action) {
    const contract = new ContractApi();
    await contract.init(null, true);
    const a = await action(contract);
    return a;
}

//allows for address aliases 
function formatAddress (contract, addr) {
    if (addr.trim().toLowerCase() == 'self')
        addr = contract.walletAddress;
        
    else if (addr.length == 1 && parseInt(addr) < testAddresses.length) {
        addr = testAddresses[parseInt(addr)]; 
    }
    return addr;
}

module.exports = {
    //MINT(address to, number quantity) 
    //  mints new tokens to given address
    mint: {
        args: ['to', 'quantity'],
        function: async (args) => {
            return await execContract(async (contract) => {
                const quantity = parseInt(args[1]);
                const addr = formatAddress(contract, args[0]); 
                await contract.mint(addr, quantity); 
                return `${quantity} minted to ${addr}`;
            });
        }
    },
    
    //TRANSFER(address from, address to, number quantity)
    //  transfers tokens from 'from' to 'to'
    transfer: {
        args: ['from', 'to', 'quantity'],
        function: async (args) => {
            return await execContract(async (contract) => {
                const quantity = parseInt(args[2]);
                const addr1 = formatAddress(contract, args[0]);
                const addr2 = formatAddress(contract, args[1]); 
                await contract.transfer(addr1, addr2, quantity);
                return `${quantity} transferred from ${addr1} to ${addr2}`;
            });
        }
    },

    //BURN(address from, number quantity)
    //  burns tokens from 'from'
    burn: {
        args: ['address', 'quantity'],
        function: async (args) => {
            if (args[0] == 'all') {
                return await execContract(async (contract) => {
                    await contract.burnAll();
                    return `entire supply burned; all balances are now zero`;
                });
            }
            else {
                return await execContract(async (contract) => {
                    const addr = formatAddress(contract, args[0]);
                    const quantity = parseInt(args[1]);
                    await contract.burn(addr, quantity);
                    return `${quantity} burned from ${addr}`;
                });
            }
        }
    },

    //BURNALL()
    //  burns all tokens 
    burnall: {
        args: [],
        function: async (args) => {
            return await execContract(async (contract) => {
                await contract.burnAll();
                return `entire supply burned; all balances are now zero`;
            });
        }
    },
    
    //WHITELIST(address) 
    //  whitelists the given address
    whitelist: {
        args: ['address'],
        function: async (args) => {
            return await execContract(async (contract) => {
                const addr = formatAddress(contract, args[0]); 
                await contract.addWhitelist(addr);
                return `${addr} added to whitelist`;
            });
        }
    },

    //UNWHITELIST(address) 
    //  removes the given address from whitelist
    unwhitelist: {
        args: ['address'],
        function: async (args) => {
            return await execContract(async (contract) => {
                const addr = formatAddress(contract, args[0]);
                await contract.removeWhitelist(addr);
                return `${addr} removed from whitelist`;
            });
        }
    },
    
    //WITHDRAW(number amount) or WITHDRAW ALL 
    //  withdraws the given amount of funds from store (or 'all')
    withdraw: {
        args: ['amount'],
        function: async (args) => {
            if (args[0] == 'all') {
                return await execContract(async (contract) => {
                    await contract.withdrawAll();
                });
            }
            else {
                return await execContract(async (contract) => {
                    await contract.withdrawFunds(parseInt(args[0]));
                });
            }
            
        }
    },
    
    //SETMINTER(address minter)
    //  changes the designated minter 
    setminter: {
        args: ['address'],
        function: async (args) => {
            return await execContract(async (contract) => {
                const addr = formatAddress(contract, args[0]);
                await contract.setDesignatedMinter(addr);
            });
        }
    },

    //CLEARMINTER()
    //  sets the designated minter to zero address 
    clearminter: {
        args: [],
        function: async () => {
            return await execContract(async (contract) => {
                await contract.setDesignatedMinter('0x0000000000000000000000000000000000000000');
            });
        }
    },
    
    //PAUSE()
    //  pauses the token contract 
    pause: {
        args: [],
        function: async () => {
            return await execContract(async (contract) => {
                await contract.pause();
                return 'contract paused';
            });
        },
    },
    
    //UNPAUSE()
    //  unpauses the token contract 
    unpause: {
        args: [],
        function: async () => {
            return await execContract(async (contract) => {
                await contract.unpause();
                return 'contract resumed after pause';
            });
        },
    },
    
    //BALANCE(address)
    //  shows the token balance of given address 
    balance: {
        args: ['address'],
        function: async (args) => {
            return await execContract(async (contract) => {
                const addr = formatAddress(contract, args[0]);
                const balance = await contract.balanceOf(addr);
                return `balance of ${addr} is ${balance.toString()}`;
            });
        },
    },
    
    //ISWHITELIST(address)
    //  indicates if given address is in whitelist 
    iswhitelist: {
        args: ['address'],
        function: async (args) => {
            return await execContract(async (contract) => {
                const addr = formatAddress(contract, args[0]);
                const isWhitelist = await contract.isWhitelisted(addr);
                return `${addr} is ${isWhitelist ? '' : 'not '}whitelisted`;
            });
        },
    },

    //MINTER()
    //  shows the current designated minter
    minter: {
        args: [],
        function: async (args) => {
            return await execContract(async (contract) => {
                const minter = await contract.getDesignatedMinter();
                return `current minter address is ${minter}`;
            });
        },
    },

    //CONTRACTS()
    //  shows current contract addresses
    contracts: {
        args: [],
        function: async (args) => {
            return `Radium is at ${abi.token.address}, MintStore is at ${abi.store.address}`;
        },
    },
}