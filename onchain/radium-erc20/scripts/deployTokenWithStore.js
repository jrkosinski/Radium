const Deployer = require("./deployer");
const Runner = require("./lib/runner");
const constants = require("./constants");

/**
 * Deploys token contract with initial specified parameters.
 */
Runner.run(async (provider, owner) => {

    console.log(' * * * ');
    console.log("Deploying ", constants.TOKEN_CONTRACT_ID);
    console.log("");

    //deploy token contract 
    const token = await Deployer.deployToken();
    console.log(`Token address is ${token.address}`);
    
    console.log("");
    console.log("Deploying ", constants.STORE_CONTRACT_ID);
    console.log("");

    //deploy store
    const store = await Deployer.deployStore(token.address);
    console.log(`Store address is ${store.address}`);
    
    //set store as designated minter
    await token.setDesignatedMinter(store.address); 

    console.log(' * * * ');
    console.log("");
});

