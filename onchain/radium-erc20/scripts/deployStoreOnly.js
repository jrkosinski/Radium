const Deployer = require("./deployer");
const Runner = require("./lib/runner");
const constants = require("./constants");

/**
 * Deploys store and associates with an already-deployed token.
 */
Runner.run(async (provider, owner) => {

    console.log(' * * * ');
    console.log(`Token address is ${constants.TOKEN_ADDRESS}`);

    console.log("");
    console.log("Deploying ", constants.STORE_CONTRACT_ID);
    console.log("");

    //deploy store
    const store = await Deployer.deployStore(constants.TOKEN_ADDRESS);
    console.log(`Store address is ${store.address}`);

    //set store as designated minter
    const token = await ethers.getContractAt(constants.TOKEN_CONTRACT_ID, constants.TOKEN_ADDRESS); 
    await token.setDesignatedMinter(store.address);

    console.log(' * * * ');
    console.log("");
});

