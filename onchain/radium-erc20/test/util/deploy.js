const ethers = require("ethers"); 
const constants = require("./constants");
const utils = require("../../scripts/lib/utils");

module.exports = {
    deployToken : async () => {
		return await utils.deployContractSilent(constants.TOKEN_CONTRACT_ID, []); 
    }, 
    
    deployMintStore : async(tokenAddress) => {
        return await utils.deployContractSilent(constants.STORE_CONTRACT_ID, [
            tokenAddress, 
            ethers.utils.parseEther(constants.STORE_TOKEN_PRICE.toString())
        ]); 
    },
    
    deployNonPayable: async () => {
        return await utils.deployContractSilent("NonPayable");
    }
};