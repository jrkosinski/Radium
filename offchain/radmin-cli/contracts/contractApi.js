const contracts = require('./abi');
const { BigNumber, ethers } = require('ethers');
const testAddresses = require('./testAddresses');

class ContractApi {
    constructor() {
        this.provider = null; 
        this.token = null; 
        this.store = null;
        this.wallet = null;
        this.balance =0;
        this.totalSupply = 0;
        this.storeRevenue = 0;
        this.whitelistCount = 0;
        this.walletAddress = ""; 
        this.paused = false;
        this.totalMinted = 0; 
        this.totalPurchased = 0; 
    }
    
    setState(stateHolder, key, value) {
        if (stateHolder && stateHolder[key])
            stateHolder[key](value); 
    }
    
    async init(stateHolder) {
        this.provider = new ethers.providers.AlchemyProvider(process.env.ETH_NETWORK, process.env.ALCHEMY_API_KEY);
        this.wallet = new ethers.Wallet(process.env.WALLET_PRIV_KEY, this.provider);

        this.token = new ethers.Contract(contracts.token.address, contracts.token.abi, this.provider);
        this.store = new ethers.Contract(contracts.store.address, contracts.store.abi, this.provider);

        this.walletAddress = await this.wallet.getAddress();
        
        if (stateHolder) {
            this.setState(stateHolder, 'setWalletAddress', this.walletAddress); 

            await Promise.all([
                this.token.paused().then((value) => {
                    this.paused = value;
                    this.setState(stateHolder, 'setPaused', this.paused);
                }),
                this.token.balanceOf(this.walletAddress).then((value) => {
                    this.balance = value;
                    this.setState(stateHolder, 'setBalance', this.balance.toString());
                }),
                this.token.totalSupply().then((value) => {
                    this.totalSupply = value;
                    this.setState(stateHolder, 'setTotalSupply', this.totalSupply.toString());
                }),
                this.provider.getBalance(this.store.address).then((value) => {
                    this.storeRevenue = ethers.utils.formatEther(value.toString()).toString();
                    this.setState(stateHolder, 'setStoreRevenue', this.storeRevenue.toString());
                }),
                this.token.whitelistCount().then((value) => {
                    this.whitelistCount = value;
                    this.setState(stateHolder, 'setWhitelistCount', this.whitelistCount.toString());
                }),
                this.token.totalMinted().then((value) => {
                    this.totalMinted = value;
                    this.setState(stateHolder, 'setTotalMinted', this.totalMinted.toString());
                }),
                this.store.totalPurchased().then((value) => {
                    this.totalPurchased = value;
                    this.setState(stateHolder, 'setTotalPurchased', this.totalPurchased.toString());
                }),
                this.token.balanceOf(testAddresses[0]).then((value) => {
                    this.setState(stateHolder, 'setTestBalance1', { address: testAddresses[0], balance: value.toString() });
                }),
                this.token.balanceOf(testAddresses[1]).then((value) => {
                    this.setState(stateHolder, 'setTestBalance2', { address: testAddresses[1], balance: value.toString() });
                }),
                this.token.balanceOf(testAddresses[2]).then((value) => {
                    this.setState(stateHolder, 'setTestBalance3', { address: testAddresses[2], balance: value.toString() });
                }),
                this.token.balanceOf(testAddresses[3]).then((value) => {
                    this.setState(stateHolder, 'setTestBalance4', { address: testAddresses[3], balance: value.toString() });
                })
            ]);
        }
    }
    
    async mint(address, quantity) {
        await this.token.connect(this.wallet).mint(address, quantity); 
    }
    
    async transfer(from, to, quantity) {
        await this.token.connect(this.wallet).transferFrom(from, to, quantity); 
    }

    async burn(address, quantity) {
        await this.token.connect(this.wallet).burn(address, quantity);
    }

    async burnAll() {
        await this.token.connect(this.wallet).burnAll();
    }

    async setDesignatedMinter(address) {
        await this.token.connect(this.wallet).setDesignatedMinter(address);
    }

    async addWhitelist(address) {
        await this.token.connect(this.wallet).addWhitelist(address);
    }

    async removeWhitelist(address) {
        await this.token.connect(this.wallet).removeWhitelist(address);
    }

    async pause(amount) {
        await this.token.connect(this.wallet).pause();
    }

    async unpause(amount) {
        await this.token.connect(this.wallet).unpause();
    }

    async getDesignatedMinter() {
        return await this.store.connect(this.wallet).designatedMinter();
    }

    async balanceOf(address) {
        return await this.token.connect(this.wallet).balanceOf(address);
    }

    async isWhitelisted(address) {
        return await this.token.connect(this.wallet).isWhitelisted(address);
    }

    async getDesignatedMinter(address) {
        return await this.token.connect(this.wallet).designatedMinter();
    }

    async withdrawFunds(amount) {
        await this.store.connect(this.wallet).withdraw(amount);
    }

    async withdrawAll(amount) {
        this.storeRevenue = ethers.utils.formatEther((await this.provider.getBalance(this.store.address)).toString()).toString();

        await this.store.connect(this.wallet).withdraw(ethers.utils.parseEther(this.storeRevenue).toString());
    }
}

module.exports = ContractApi;