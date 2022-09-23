const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const { expectEvent, expectRevert } = require("./util/testUtils");

describe(constants.TOKEN_CONTRACT_ID + ": Owner Transferring", function () {
    let token;				        //contracts
    let owner, addr1, addr2, addr3;	//accounts
    let quantityMinted;
    const userMintQuantity = 10000;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        //contract
        token = await deploy.deployToken();

        await token.mint(addr1.address, userMintQuantity);
        await token.mint(addr2.address, userMintQuantity);
        await token.mint(addr3.address, userMintQuantity);

        await token.addWhitelist(addr1.address);
        await token.addWhitelist(addr2.address);
        await token.addWhitelist(addr3.address);

        //to test that transfers do not affect total supply
        quantityMinted = parseInt(await token.totalSupply());
    });

    describe("Initial State", function () {
        it("Initial balances", async function () {
            expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity);
            expect(await token.balanceOf(addr2.address)).to.equal(userMintQuantity);
            expect(await token.balanceOf(addr3.address)).to.equal(userMintQuantity);
        });
    });

    describe("Simple Transfer", function () {
        it("owner can transfer to non-owner", async function () {
            const amount = 1000;
            await token.transfer(addr1.address, amount);

            //check that transfer was credited and debited
            expect(await token.balanceOf(owner.address)).to.equal(constants.INITIAL_SUPPLY - amount);
            expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity + amount);
            expect(await token.totalSupply()).to.equal(quantityMinted);
        });

        it("non-owner can transfer to owner", async function () {
            const amount = 1000;
            await token.connect(addr1).transfer(owner.address, amount);

            //check that transfer was credited and debited
            expect(await token.balanceOf(owner.address)).to.equal(constants.INITIAL_SUPPLY + amount);
            expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - amount);
            expect(await token.totalSupply()).to.equal(quantityMinted);
        });
    });

    describe("Administrative Transfer", function () {
        it("owner has implicit allowance for any amount", async () => {
            expect(await token.allowance(addr1.address, owner.address)).to.equal(await token.balanceOf(addr1.address));
            expect(await token.allowance(addr2.address, owner.address)).to.equal(await token.balanceOf(addr2.address));
            expect(await token.allowance(addr3.address, owner.address)).to.equal(await token.balanceOf(addr3.address));
        });

        it("users do not have implicit allowance", async () => {
            expect(await token.allowance(addr1.address, addr2.address)).to.equal(0);
            expect(await token.allowance(addr2.address, addr3.address)).to.equal(0);
            expect(await token.allowance(addr3.address, addr1.address)).to.equal(0);
        });
        
        it("owner transfers between two parties without explicit approval", async () => {
            const amount = 100;
            await token.transferFrom(addr1.address, addr2.address, amount); 

            expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - amount);
            expect(await token.balanceOf(addr2.address)).to.equal(userMintQuantity + amount);
            expect(await token.totalSupply()).to.equal(quantityMinted);
        });

        it("owner transfers from user to self without explicit approval", async () => {
            const amount = 100;
            await token.transferFrom(addr1.address, owner.address, amount);

            expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - amount);
            expect(await token.balanceOf(owner.address)).to.equal(constants.INITIAL_SUPPLY + amount);
            expect(await token.totalSupply()).to.equal(quantityMinted);
        });

        it("transfer cannot exceed user balance", async () => {
            await expectRevert(
               () => token.transferFrom(addr1.address, addr2.address, userMintQuantity +1),
               constants.errorMessages.INSUFFICIENT_ALLOWANCE 
            ); 
        });

        it("when ownership changes, default allowances also change", async () => {
            const newOwner = addr1; 
            const oldOwner = owner; 
            
            await token.transferOwnership(newOwner.address);
            
            expect(await token.balanceOf(addr2.address)).to.equal(10000);

            expect(await token.allowance(addr2.address, newOwner.address)).to.equal(await token.balanceOf(addr2.address));
            expect(await token.allowance(addr3.address, newOwner.address)).to.equal(await token.balanceOf(addr2.address));

            expect(await token.allowance(addr2.address, oldOwner.address)).to.equal(0);
            expect(await token.allowance(addr3.address, oldOwner.address)).to.equal(0);
        });

        it("cannot transfer from zero address", async () => {
            await expectRevert(
                () => token.transferFrom(constants.ZERO_ADDRESS, addr1.address, 1)
            );
        });

        it("cannot transfer to zero address", async () => {
            await expectRevert(
                () => token.transferFrom(addr1.address, constants.ZERO_ADDRESS, 1)
            );
        });

        it("cannot transfer to non-whitelisted address", async () => {
            await token.removeWhitelist(addr1.address); 
            
            await expectRevert(
                () => token.transferFrom(addr2.address, addr1.address, 1), 
                constants.errorMessages.NOT_WHITELISTED
            );
        });
    });

    describe("Events", function () {
        it("transfer event fires on transferFrom", async () => {
            await expectEvent(
                () => token.transferFrom(addr1.address, addr2.address, 100),
                "Transfer", [
                    addr1.address, addr2.address, 100
                ]);
        });
    });
});