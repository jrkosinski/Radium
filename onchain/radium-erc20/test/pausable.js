const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const { expectRevert, expectEvent } = require("./util/testUtils");

describe(constants.TOKEN_CONTRACT_ID + ": Pausable", function () {
    let token;				            //contracts
    let owner, addr1, addr2, addr3; 	//accounts

    beforeEach(async function () {
        [owner, addr1, addr2, addr3,...addrs] = await ethers.getSigners();

        //contract
        token = await deploy.deployToken();
    });

    describe("Initial State", function () {
        it("initial value", async function () {
            expect(await token.paused()).to.equal(false);
        });
    });

    describe("Permissions", function () {
        it("owner can pause", async function () {
            await token.pause(); 
            expect(await token.paused()).to.equal(true); 
        });

        it("owner can unpause", async function () {
            await token.pause();
            expect(await token.paused()).to.equal(true); 

            await token.unpause();
            expect(await token.paused()).to.equal(false); 
        });

        it("non-owner cannot pause", async function () {
            await expectRevert(
                () => token.connect(addr1).pause(),
                constants.errorMessages.OWNER_ONLY
            );
        });

        it("non-owner cannot unpause", async function () {
            await token.pause();
            await expectRevert(
                () => token.connect(addr1).unpause(),
                constants.errorMessages.OWNER_ONLY
            );
        });

        it("cannot pause when paused", async function () {
            await token.pause();
            await expectRevert(
                () => token.pause(),
                constants.errorMessages.PAUSED
            );
        });

        it("cannot unpause when not paused", async function () {
            await expectRevert(
                () => token.unpause(),
                constants.errorMessages.NOT_PAUSED
            );
        });
    });

    describe("Paused Behavior", function () {
        this.beforeEach(async function() {
            await token.addWhitelist(addr1.address);
            await token.addWhitelist(addr2.address);
            await token.addWhitelist(addr3.address);
            await token.pause();
        });
        
        it("cannot mint when paused", async function () {
            await expectRevert(
                () => token.mint(addr1.address, 1), 
                constants.errorMessages.PAUSED
            ); 
        });

        it("cannot transfer when paused", async function () {
            await expectRevert(
                () => token.transfer(addr1.address, 1),
                constants.errorMessages.PAUSED
            ); 
        });

        it("cannot approve when paused", async function () {
            await expectRevert(
                () => token.approve(addr1.address, 1),
                constants.errorMessages.PAUSED
            ); 
        });

        it("cannot transferFrom when paused", async function () {
            await expectRevert(
                () => token.transferFrom(addr1.address, addr2.address, 1),
                constants.errorMessages.PAUSED
            ); 
        });

        it("cannot add to whitelist when paused", async function () {
            await expectRevert(
                () => token.addWhitelist(addr1.address),
                constants.errorMessages.PAUSED
            ); 
        });

        it("cannot remove from whitelist when paused", async function () {
            await expectRevert(
                () => token.removeWhitelist(addr1.address),
                constants.errorMessages.PAUSED
            ); 
        });

        it("cannot burn when paused", async function () {
            await expectRevert(
                () => token.burn(addr1.address, 1),
                constants.errorMessages.PAUSED
            ); 
        });

        it("cannot burn all when paused", async function () {
            await expectRevert(
                () => token.burnAll(),
                constants.errorMessages.PAUSED
            ); 
        });

        it("cannot set designated minter when paused", async function () {
            await expectRevert(
                () => token.setDesignatedMinter(addr1.address),
                constants.errorMessages.PAUSED
            ); 
        });
    });

    describe("Events", function () {
        it("pausing emits Paused", async function () {
            await expectEvent(
                () => token.pause(),
                "Paused", [owner.address]
            );
        });

        it("unpausing emits Unpaused", async function () {
            await token.pause();
            await expectEvent(
                () => token.unpause(),
                "Unpaused", [owner.address]
            );
        });
    });
});