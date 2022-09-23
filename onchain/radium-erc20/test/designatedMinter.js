const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const { expectEvent, expectNoEvent, expectRevert } = require("./util/testUtils");

describe(constants.TOKEN_CONTRACT_ID + ": Designated Minter", function () {
    let token;				    //contracts
    let owner, addr1, addr2; 	//accounts

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        //contract
        token = await deploy.deployToken();
    });

    describe("Set DesignatedMinter Permissions", function () {
        it("owner can set designated minter", async function () {
            await token.setDesignatedMinter(addr1.address); 
            expect(await token.designatedMinter()).to.equal(addr1.address);
        });

        it("non-owner cannot set designated minter", async function () {
            //lack of permissions should result in revert 
            await expectRevert(
                () => token.connect(addr1).setDesignatedMinter(addr1.address),
                constants.errorMessages.OWNER_ONLY
            );
        });

        it("designated minter can mint", async function () {
            await token.setDesignatedMinter(addr1.address);
            expect(await token.designatedMinter()).to.equal(addr1.address);
            
            await token.connect(addr1).mint(addr1.address, 10); 
            expect(await token.totalSupply()).to.equal(constants.INITIAL_SUPPLY + 10);
        });
    });

    describe("Events", function () {
        it("setDesignatedMinter emits DesignatedMinterSet", async function () {
            await expectEvent(
                () => token.setDesignatedMinter(addr1.address),
                "DesignatedMinterSet", [addr1.address]
            ); 
        });

        it("setDesignatedMinter doesn't emit if set with duplicate", async function () {
            await expectEvent(
                () => token.setDesignatedMinter(addr1.address),
                "DesignatedMinterSet", [addr1.address]
            );
            
            //second, event should not emit
            await expectNoEvent(
                () => token.setDesignatedMinter(addr1.address),
                "DesignatedMinterSet"
            );
        });
    });
});