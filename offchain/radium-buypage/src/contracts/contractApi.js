
import contracts from './abi';
import { BigNumber, ethers } from 'ethers';

/**
 * Provides access to Radium and MintStore contracts on the blockchain. 
 * 
 * Usage: 
 * let api = await new ContractApi(); 
 * await api.init(); //call init first 
 * await api.refreshBalance();
 */
export default class ContractApi {
    constructor() {
        this.provider = null; 
        this.signer = null; 
        this.token = null; 
        this.store = null; 
        this.tokenPrice = null; 
        this.balance = null;
        this.walletAddress = null; 
    }
    
    /**
     * Call this first; connects the contracts to the blockchain and reads some essential properties. 
     */
    async init() {
        this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await this.provider.send("eth_requestAccounts", []);
        this.signer = this.provider.getSigner();
        this.walletAddress = await this.signer.getAddress(); 

        this.token = new ethers.Contract(contracts.token.address, contracts.token.abi, this.provider);
        this.balance = await this.token.balanceOf(this.signer.getAddress());

        this.store = new ethers.Contract(contracts.store.address, contracts.store.abi, this.provider);
        this.tokenPrice = await this.store.price();
    }
    
    /**
     * Purchases tokens from the store. 
     * Listens for the event after purchase, and resolves the Promise after event received. 
     * @param {number} quantity number of tokens to purchase 
     */
    async buyTokens(quantity) {
        console.log(this.store);
        await this.store.connect(this.signer).buyTokens(quantity, { value: BigNumber.from(quantity).mul(this.tokenPrice) }); 
        
        return new Promise((resolve, reject) => {
            const filter = {
                address: this.store.address,
                topics: [
                    ethers.utils.id("TokenPurchase(address,uint256)"), 
                    ethers.utils.hexZeroPad(this.walletAddress, 32)
                ]
            }

            this.provider.on(filter, (e) => {
                console.log(e); 
                resolve();
            })
        });
    }
    
    async refreshBalance() {
        this.balance = await this.token.balanceOf(this.walletAddress);
    }
}