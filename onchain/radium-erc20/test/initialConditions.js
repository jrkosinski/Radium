const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

describe(constants.TOKEN_CONTRACT_ID + ": Initial Conditions", function () {
    let token;				    //contracts
    let owner, addr1, addr2; 	//accounts

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        //contract
        token = await deploy.deployToken();
    });

    describe("Initial State", function () {
        it("initial balances", async function () {
            expect(await token.totalSupply()).to.equal(constants.INITIAL_SUPPLY);
            expect(await token.totalMinted()).to.equal(constants.INITIAL_SUPPLY);
            
            expect(await token.balanceOf(owner.address)).to.equal(await token.totalSupply()); 
            expect(await token.balanceOf(addr1.address)).to.equal(0);
            expect(await token.balanceOf(addr2.address)).to.equal(0); 
        });

        it("security", async function () {
            expect(await token.owner()).to.equal(owner.address);
            expect(await token.paused()).to.equal(false); 
        });

        it("metadata", async function () {
            expect(await token.name()).to.equal(constants.TOKEN_NAME);
            expect(await token.symbol()).to.equal(constants.TOKEN_SYMBOL);
            expect(await token.decimals()).to.equal(18);
        });

        it("designated minter", async function () {
            expect(await token.designatedMinter()).to.equal(constants.ZERO_ADDRESS);
        });
    });
});