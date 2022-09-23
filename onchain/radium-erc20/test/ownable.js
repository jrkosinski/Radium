const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const { expectRevert } = require("./util/testUtils");

describe(constants.TOKEN_CONTRACT_ID + ": Ownable", function () {
    let token;				    //contracts
    let owner, addr1, addr2; 	//accounts

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        //contract
        token = await deploy.deployToken();
    });

    describe("Owner Permissions", function () {
        it("owner can transfer ownership", async function () {
            expect(await token.owner()).to.equal(owner.address);
            
            await token.transferOwnership(addr1.address); 
            expect(await token.owner()).to.equal(addr1.address); 

            //previous owner can no longer mint 
            await expectRevert(
                () => token.renounceOwnership(),
                constants.errorMessages.OWNER_ONLY
            );
            
            //new owner can 
            await expect(
                token.connect(addr1).mint(addr1.address, 10)
            ).to.not.be.reverted;
        });

        it("owner can renounce ownership", async function () {
            expect(await token.owner()).to.equal(owner.address);

            await token.renounceOwnership();
            expect(await token.owner()).to.equal(constants.ZERO_ADDRESS); 
            
            //can no longer mint 
            await expectRevert(
                () => token.renounceOwnership(),
                constants.errorMessages.OWNER_ONLY
            );
        });

        it("non-owner cannot transfer ownership", async function () {
            //lack of permissions should result in revert
            await expectRevert(
                () => token.connect(addr1).transferOwnership(addr2.address), 
                constants.errorMessages.OWNER_ONLY
            ); 
        });

        it("non-owner cannot renounce ownership", async function () {
            //lack of permissions should result in revert
            await expectRevert(
                () => token.connect(addr1).renounceOwnership(),
                constants.errorMessages.OWNER_ONLY
            ); 
        });
    });
});