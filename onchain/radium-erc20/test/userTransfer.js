const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const { expectEvent, expectRevert } = require("./util/testUtils");

describe(constants.TOKEN_CONTRACT_ID + ": User to User Transferring", function () {
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
        it("non-owner can transfer tokens", async function () {
            const amount = 1000;
            await token.connect(addr1).transfer(addr2.address, amount);

            //check that transfer was credited and debited
            expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - amount);
            expect(await token.balanceOf(addr2.address)).to.equal(userMintQuantity + amount);
            expect(await token.totalSupply()).to.equal(quantityMinted); 
        });

        it("non-owner double transfer", async function () {
            const amount1 = 1000;
            const amount2 = 2000;

            //then transfer them from addr1 to addr2
            await token.connect(addr1).transfer(addr2.address, amount1);
            await token.connect(addr2).transfer(addr3.address, amount2);

            //check that transfer was credited and debited accordingly
            expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - amount1);
            expect(await token.balanceOf(addr2.address)).to.equal(userMintQuantity + amount1 - amount2);
            expect(await token.balanceOf(addr3.address)).to.equal(userMintQuantity + amount2);
            expect(await token.totalSupply()).to.equal(quantityMinted); 
        });

        it("cannot transfer more than balance", async function () {
            await expectRevert(
                () => token.connect(addr1).transfer(addr2.address, userMintQuantity + 1), 
                constants.errorMessages.TRANSFER_EXCEEDS_BALANCE
            );
        });

        it("cannot transfer to zero address", async function () {
            await expectRevert(
                () => token.transfer(constants.ZERO_ADDRESS, 1)
            );
        });
    });

    describe("Approve and Transfer", function () {
        describe("Approve Single", function () {
            it("non-owner can approve a spender", async function () {
                await token.connect(addr1).approve(addr2.address, 1);
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(1); 
            });

            it("non-owner can approve and transfer", async function () {
                const amount = 100;
                await token.connect(addr1).approve(addr2.address, amount);
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(amount); 
                await token.connect(addr2).transferFrom(addr1.address, addr2.address, amount);

                //check that transfer was credited and debited
                expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - amount);
                expect(await token.balanceOf(addr2.address)).to.equal(userMintQuantity + amount);
                
                //check that allowance is cleared 
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(0); 
            });

            it("non-owner can approve and transfer to a third user", async function () {
                const amount = 100;
                await token.connect(addr1).approve(addr2.address, amount);
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(amount); 

                await token.connect(addr2).transferFrom(addr1.address, addr3.address, amount);

                //check that transfer was credited and debited
                expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - amount);
                expect(await token.balanceOf(addr2.address)).to.equal(userMintQuantity);
                expect(await token.balanceOf(addr3.address)).to.equal(userMintQuantity + amount);

                //check that allowance is cleared 
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(0); 
            });

            it("non-owner can cannot approve and double transfer", async function () {
                const amount = 100;
                await token.connect(addr1).approve(addr2.address, amount);

                //transfer from owner to addr2, using addr1 as middleman after approval
                await token.connect(addr2).transferFrom(addr1.address, addr3.address, amount);

                //try to transfer another one
                await expectRevert(
                    () => token.connect(addr2).transferFrom(addr1.address, addr3.address, 1),
                    constants.errorMessages.INSUFFICIENT_ALLOWANCE
                ); 

                expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - amount);
                expect(await token.balanceOf(addr2.address)).to.equal(userMintQuantity);
                expect(await token.balanceOf(addr3.address)).to.equal(userMintQuantity + amount);
            });

            it("spender can spend partial allowance", async function () {
                const allowance = 100;
                const amount1 = 80; 
                const amount2 = 20;
                await token.connect(addr1).approve(addr2.address, allowance);
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(allowance);

                await token.connect(addr2).transferFrom(addr1.address, addr3.address, amount1);
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(allowance - amount1);

                //check that transfer was credited and debited
                expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - amount1);
                expect(await token.balanceOf(addr2.address)).to.equal(userMintQuantity);
                expect(await token.balanceOf(addr3.address)).to.equal(userMintQuantity + amount1);
                
                await token.connect(addr2).transferFrom(addr1.address, addr3.address, amount2);
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(0);
                
                //check that transfer was credited and debited
                expect(await token.balanceOf(addr1.address)).to.equal(userMintQuantity - allowance);
                expect(await token.balanceOf(addr2.address)).to.equal(userMintQuantity);
                expect(await token.balanceOf(addr3.address)).to.equal(userMintQuantity + allowance);

                //check that allowance is cleared 
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(0); 
            });

            it("spending cannot exceed allowance", async function () {
                const allowance = 100;
                await token.connect(addr1).approve(addr2.address, allowance);
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(allowance);

                await expectRevert(
                    () => token.connect(addr2).transferFrom(addr1.address, addr3.address, allowance +1), 
                    constants.errorMessages.INSUFFICIENT_ALLOWANCE
                );
            });

            it("non-owner cannot transfer without approval", async function () {
                expect(await token.allowance(addr1.address, addr2.address)).to.equal(0);

                await expectRevert(
                    () => token.connect(addr2).transferFrom(addr1.address, addr3.address, 1),
                    constants.errorMessages.INSUFFICIENT_ALLOWANCE
                );
            });

            it("cannot approve to zero address", async function () {
                await expectRevert(
                    () => token.approve(constants.ZERO_ADDRESS, 1)
                );
            }); 
        });
        
        //TODO: multiple spenders approved on same account
    });

    describe("Events", function () {
        it("transfer event fires on transfer", async () => {
            await expectEvent(() => token.connect(addr1).transfer(addr2.address, 100),
                "Transfer", [addr1.address, addr2.address, 100]);
        });

        it("approve event fires on approve", async () => {
            await expectEvent(() => token.connect(addr1).approve(addr2.address, 10),
                "Approval", [addr1.address, addr2.address, 10]);
        });

        it("transfer event fires on transferFrom", async () => {
            await token.connect(addr1).approve(addr2.address, 100);
            await expectEvent(() => token.connect(addr2).transferFrom(addr1.address, addr3.address, 100),
                "Transfer", [addr1.address, addr3.address, 100]);
        });
    });
});