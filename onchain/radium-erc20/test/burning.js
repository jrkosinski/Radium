const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const { expectEvent, expectRevert } = require("./util/testUtils");

//TODO: burning clears allowances? 
//TODO: can recover (rebuild) after burnAll

describe(constants.TOKEN_CONTRACT_ID + ": Burning", function () {
    let token;				            //contracts
    let owner, addr1, addr2, addr3; 	//accounts

    beforeEach(async function () {
        [owner, addr1, addr2, addr3,...addrs] = await ethers.getSigners();

        //contract
        token = await deploy.deployToken();

        await token.mint(addr1.address, 10000);
        await token.mint(addr2.address, 10000);
        await token.mint(addr3.address, 10000); 
    });

    describe("Initial State", function () {
        it("initial balances", async function () {
            expect(await token.balanceOf(addr1.address)).to.equal(10000);
            expect(await token.balanceOf(addr2.address)).to.equal(10000);
            expect(await token.balanceOf(addr3.address)).to.equal(10000);
        });
    });

    describe("Burning from Specific Addresses", function () {
        it("owner can burn own tokens", async function () {
            const burnQuantity = 1000; 
            const initialBalance = parseInt(await token.balanceOf(owner.address)); 
            const initialSupply = parseInt(await token.totalSupply()); 
            
            await token.burn(owner.address, burnQuantity); 

            expect(await token.balanceOf(owner.address)).to.equal(initialBalance - burnQuantity); 
            expect(await token.totalSupply()).to.equal(initialSupply - burnQuantity); 
        });

        it("owner can burn another's tokens", async function () {
            const burnQuantity = 1000;
            const initialBalance = parseInt(await token.balanceOf(addr1.address));
            const initialSupply = parseInt(await token.totalSupply());

            await token.burn(addr1.address, burnQuantity);

            expect(await token.balanceOf(addr1.address)).to.equal(initialBalance - burnQuantity);
            expect(await token.totalSupply()).to.equal(initialSupply - burnQuantity); 
        });

        it("owner can't burn more than total owned by self", async function () {
            const initialBalance = parseInt(await token.balanceOf(owner.address));
            const burnQuantity = initialBalance + 1;

            await expectRevert(
                () => token.burn(owner.address, burnQuantity),
                constants.errorMessages.BURN_EXCEEDED
            );
        });

        it("owner can't burn more than total owned by another", async function () {
            const initialBalance = parseInt(await token.balanceOf(addr1.address));
            const burnQuantity = initialBalance + 1;

            await expectRevert(
                () => token.burn(addr1.address, burnQuantity),
                constants.errorMessages.BURN_EXCEEDED
            );
        });
        
        it("cannot burn to zero address", async function() {
            await expectRevert(
                () => token.burn(constants.ZERO_ADDRESS, 1)
            );
        });
    });

    describe("BurnAll", function () {
        it("owner can burn entire supply at once", async function () {
            await token.burnAll(); 
            
            expect(await token.totalSupply()).to.equal(0);
            expect(await token.balanceOf(owner.address)).to.equal(0);
            expect(await token.balanceOf(addr1.address)).to.equal(0);
            expect(await token.balanceOf(addr2.address)).to.equal(0);
            expect(await token.balanceOf(addr3.address)).to.equal(0); 
        });

        it("burnAll clears allowances", async function () {
            const allowance = 10;
            await token.connect(addr1).approve(addr2.address, allowance);
            await token.connect(addr2).approve(addr3.address, allowance);
            await token.connect(addr3).approve(addr1.address, allowance);

            expect(await token.allowance(addr1.address, addr2.address)).to.equal(allowance);
            expect(await token.allowance(addr2.address, addr3.address)).to.equal(allowance);
            expect(await token.allowance(addr3.address, addr1.address)).to.equal(allowance);
            
            await token.burnAll();

            expect(await token.allowance(addr1.address, addr2.address)).to.equal(0);
            expect(await token.allowance(addr2.address, addr3.address)).to.equal(0);
            expect(await token.allowance(addr3.address, addr1.address)).to.equal(0);
        });
    });

    describe("Burning Permissions", function () {
        it("owner can burn", async function () {
            await expect(
                token.burn(addr1.address, 10)
            ).to.not.be.reverted;
        });

        it("owner can burn all", async function () {
            await expect(
                token.burnAll()
            ).to.not.be.reverted;
        });

        it("non-owner cannot burn", async function () {
            //lack of permissions should result in revert 
            await expectRevert(
                () => token.connect(addr1).burn(addr1.address, 10),
                constants.errorMessages.OWNER_ONLY
            );
            await expectRevert(
                () => token.connect(addr2).burn(addr2.address, 10),
                constants.errorMessages.OWNER_ONLY
            );
        });

        it("non-owner cannot burn all", async function () {
            //lack of permissions should result in revert 
            await expectRevert(
                () => token.connect(addr1).burnAll(),
                constants.errorMessages.OWNER_ONLY
            );
            await expectRevert(
                () => token.connect(addr2).burnAll(),
                constants.errorMessages.OWNER_ONLY
            );
        });

        it("can recover state after burnAll", async function () {
            await token.burnAll(); 
            await token.mint(addr1.address, 10000);
            await token.mint(addr2.address, 10000);
            await token.mint(addr3.address, 10000); 
            
            expect(await token.balanceOf(addr1.address)).to.equal(10000);
            expect(await token.balanceOf(addr2.address)).to.equal(10000);
            expect(await token.balanceOf(addr3.address)).to.equal(10000);

            const allowance = 10;
            await token.connect(addr1).approve(addr2.address, allowance);
            await token.connect(addr2).approve(addr3.address, allowance);
            await token.connect(addr3).approve(addr1.address, allowance);

            expect(await token.allowance(addr1.address, addr2.address)).to.equal(allowance);
            expect(await token.allowance(addr2.address, addr3.address)).to.equal(allowance);
            expect(await token.allowance(addr3.address, addr1.address)).to.equal(allowance);
        });
    });

    describe("Burning Events", function () {
        it("burning emits Transfer", async function () {
            await expectEvent(
                () => token.burn(addr1.address, 11),
                "Transfer",
                [addr1.address, constants.ZERO_ADDRESS, 11]
            );
        });
        
        it("burning all emits BurnAll", async function () {
            await expectEvent(
                () => token.burnAll(),
                "BurnAll"
            );
        });
    });
});