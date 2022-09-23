const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const { expectRevert, expectEvent, expectNoEvent } = require("./util/testUtils");

describe(constants.TOKEN_CONTRACT_ID + ": Whitelist", function () {
    let token;				                //contracts
    let owner, addr1, addr2, addr3, addr4; 	//accounts

    beforeEach(async function () {
        [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();

        //contract
        token = await deploy.deployToken();
    });

    describe("Initial State", function () {
        it("initial whitelist is empty", async function () {
            expect(await token.isWhitelisted(addr1.address)).to.equal(false);
            expect(await token.isWhitelisted(addr2.address)).to.equal(false);
            expect(await token.isWhitelisted(addr3.address)).to.equal(false); 
        });

        it("owner is always whitelisted by default", async function () {
            expect(await token.isWhitelisted(owner.address)).to.equal(true);
        });
    });

    describe("Managing Whitelist", function () {
        it("owner can add to whitelist", async function () {
            await token.addWhitelist(addr1.address); 
            expect(await token.isWhitelisted(addr1.address)).to.equal(true); 
        });

        it("non-owner cannot add to whitelist", async function () {
            await expectRevert(
                () => token.connect(addr1).addWhitelist(addr1.address),
                constants.errorMessages.OWNER_ONLY
            );
        });
        
        it("owner can remove from whitelist", async function () {
            await token.addWhitelist(addr1.address);
            expect(await token.isWhitelisted(addr1.address)).to.equal(true); 

            await token.removeWhitelist(addr1.address);
            expect(await token.isWhitelisted(addr1.address)).to.equal(false); 
        });

        it("non-owner cannot remove from whitelist", async function () {
            await token.addWhitelist(addr1.address);
            expect(await token.isWhitelisted(addr1.address)).to.equal(true); 

            await expectRevert(
                () => token.connect(addr1).removeWhitelist(addr1.address),
                constants.errorMessages.OWNER_ONLY
            );
        });

        it("double-add user to whitelist", async function () {
            await token.addWhitelist(addr1.address);
            expect(await token.whitelistCount()).to.equal(1);
            await token.addWhitelist(addr2.address);
            expect(await token.whitelistCount()).to.equal(2);
            await token.addWhitelist(addr2.address);
            expect(await token.whitelistCount()).to.equal(2); 
        });

        it("double-remove user from whitelist", async function () {
            await token.addWhitelist(addr1.address);
            await token.addWhitelist(addr2.address);
            expect(await token.whitelistCount()).to.equal(2);

            await token.removeWhitelist(addr1.address);
            expect(await token.whitelistCount()).to.equal(1);

            await token.removeWhitelist(addr1.address);
            expect(await token.whitelistCount()).to.equal(1); 
        });
    });

    describe("Buying and Minting", function () {
        let mintStore; 
        let whitelisted, nonWhitelisted;
        
        beforeEach(async function () {
            whitelisted = addr1; 
            nonWhitelisted = addr2; 
            
            mintStore = await deploy.deployMintStore(token.address);
            await token.addWhitelist(addr1.address); 
            await token.setDesignatedMinter(mintStore.address); 
        });
        
        it("non-whitelisted address can purchase", async function () {
            expect(await token.balanceOf(nonWhitelisted.address)).to.equal(0); 
            await mintStore.connect(nonWhitelisted).buyTokens(
                1, 
                { value: ethers.utils.parseEther((constants.STORE_TOKEN_PRICE.toString()))}
            );
            expect(await token.balanceOf(nonWhitelisted.address)).to.equal(1); 
        });
        
        it("whitelisted address can purchase", async function () {
            expect(await token.balanceOf(whitelisted.address)).to.equal(0);
            await mintStore.connect(whitelisted).buyTokens(
                1,
                { value: ethers.utils.parseEther((constants.STORE_TOKEN_PRICE.toString())) }
            );
            expect(await token.balanceOf(whitelisted.address)).to.equal(1); 
        });
    });

    describe("Transferring", function () {
        let nonWhitelisted1;
        let nonWhitelisted2;
        let whitelisted1;
        let whitelisted2;
        const userMintQuantity = 10000; 
        
        beforeEach(async function() {
            whitelisted1 = addr1;
            whitelisted2 = addr2;
            nonWhitelisted1 = addr3;
            nonWhitelisted2 = addr4; 
            
            await token.addWhitelist(whitelisted1.address);
            await token.addWhitelist(whitelisted2.address); 

            await token.mint(nonWhitelisted1.address, userMintQuantity);
            await token.mint(nonWhitelisted2.address, userMintQuantity);
            await token.mint(whitelisted1.address, userMintQuantity);
            await token.mint(whitelisted2.address, userMintQuantity);
        });

        async function testCanTransferTo(from, to, amount, expectedToSucceed) {
            if (expectedToSucceed) {
                await token.connect(from).transfer(to.address, amount);

                expect(await token.balanceOf(from.address)).to.equal(userMintQuantity - amount);
                expect(await token.balanceOf(to.address)).to.equal(userMintQuantity + amount);
            }
            else {
                await expectRevert(
                    () => token.connect(from).transfer(to.address, amount), 
                    constants.errorMessages.NOT_WHITELISTED
                );
            }
        }

        async function testCanApprove(approver, spender, amount, expectedToSucceed) {
            if (expectedToSucceed) {
                await token.connect(approver).approve(spender.address, amount);

                expect(await token.allowance(approver.address, spender.address)).to.equal(amount);
            }
            else {
                await expectRevert(
                    () => token.connect(approver).approve(spender.address, amount),
                    constants.errorMessages.NOT_WHITELISTED
                );
            }
        }

        async function testCanTransferFromTo(approver, spender, to, amount, expectedToSucceed) {
            await token.connect(approver).approve(spender.address, amount);
            
            if (expectedToSucceed) {
                await token.connect(spender).transferFrom(approver.address, to.address, amount); 

                expect(await token.balanceOf(approver.address)).to.equal(userMintQuantity - amount);
                expect(await token.balanceOf(to.address)).to.equal(userMintQuantity + amount);
            }
            else {
                await expectRevert(
                    () => token.connect(spender).transferFrom(approver.address, to.address, amount),
                    constants.errorMessages.NOT_WHITELISTED
                );
            }
        }
        
        it("non-whitelisted address can transfer to whitelisted recipient", async function () {
            await testCanTransferTo(nonWhitelisted1, whitelisted1, 10, true);
        });

        it("non-whitelisted address cannot transfer to non-whitelisted recipient", async function () {
            await testCanTransferTo(nonWhitelisted1, nonWhitelisted2, 10, false);
        });

        it("whitelisted address can transfer to whitelisted recipient", async function () {
            await testCanTransferTo(whitelisted1, whitelisted2, 10, true);
        });

        it("whitelisted address cannot transfer to non-whitelisted recipient", async function () {
            await testCanTransferTo(whitelisted1, nonWhitelisted1, 10, false);
        });

        it("non-whitelisted address can approve whitelisted recipient", async function () {
            await testCanApprove(nonWhitelisted1, whitelisted1, 10, true); 
        });

        it("non-whitelisted address can approve non-whitelisted recipient", async function () {
            await testCanApprove(nonWhitelisted1, nonWhitelisted2, 10, true); 
        });

        it("whitelisted address can approve whitelisted recipient", async function () {
            await testCanApprove(whitelisted1, whitelisted2, 10, true); 
        });

        it("whitelisted address can approve non-whitelisted recipient", async function () {
            await testCanApprove(whitelisted1, nonWhitelisted1, 10, true); 
        });
        
        it("non-whitelisted address can transferFrom to whitelisted recipient", async function () {
            await testCanTransferFromTo(whitelisted1, nonWhitelisted1, whitelisted2, 10, true);
        });

        it("non-whitelisted address cannot transferFrom to non-whitelisted recipient", async function () {
            await testCanTransferFromTo(whitelisted1, nonWhitelisted1, nonWhitelisted2, 10, false);
        });

        it("whitelisted address can transferFrom to whitelisted recipient", async function () {
            await testCanTransferFromTo(nonWhitelisted2, whitelisted1, whitelisted2, 10, true);
        });

        it("whitelisted address cannot transferFrom to non-whitelisted recipient", async function () {
            await testCanTransferFromTo(whitelisted1, whitelisted2, nonWhitelisted1, 10, false);
        });
    });
    
    describe("Ownershsip", function () {
        it("transferring ownership automatically transfers whitelist status", async function () {
            expect(await token.isWhitelisted(owner.address)).to.equal(true); 
            expect(await token.isWhitelisted(addr1.address)).to.equal(false); 
            
            await token.transferOwnership(addr1.address);
            
            expect(await token.isWhitelisted(owner.address)).to.equal(false);
            expect(await token.isWhitelisted(addr1.address)).to.equal(true); 
        });

        it("cannot remove owner from whitelist", async function () {
            await token.removeWhitelist(owner.address); 
            expect(await token.isWhitelisted(owner.address)).to.equal(true); 
        });
    });

    describe("Events", function () {
        it("addWhitelist emits AddToWhitelist", async function () {
            await expectEvent(
                () => token.addWhitelist(addr1.address),
                "AddToWhitelist", [addr1.address]
            ); 
        });
        
        it("addWhitelist does not emit AddToWhitelist if duplicate", async function () {
            await expectEvent(
                () => token.addWhitelist(addr1.address),
                "AddToWhitelist", [addr1.address]
            );

            //should not emit a second time
            await expectNoEvent(
                () => token.addWhitelist(addr1.address),
                "AddToWhitelist"
            );
        });

        it("removeWhitelist does not emit RemoveFromWhitelist if redundant", async function () {
            await token.addWhitelist(addr1.address);

            await expectEvent(
                () => token.removeWhitelist(addr1.address),
                "RemoveFromWhitelist", [addr1.address]
            );

            //should not emit a second time
            await expectNoEvent(
                () => token.removeWhitelist(addr1.address),
                "RemoveFromWhitelist"
            ); 
        });
    });
});