const utils = require("./lib/utils");
const constants = require("./constants"); 


module.exports = {
    deployToken: async () => {
        return await utils.deployContractSilent(constants.TOKEN_CONTRACT_ID); 
    },
    
    deployStore: async (tokenAddress) => {
        return await utils.deployContractSilent(constants.STORE_CONTRACT_ID, [
            tokenAddress,
            ethers.utils.parseEther(constants.STORE_TOKEN_PRICE.toString())
        ]); 
    }
};

