const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const { expectRevert, expectEvent } = require("./util/testUtils");

const provider = waffle.provider;

describe(constants.TOKEN_CONTRACT_ID + ": Mint Store", function () {
    let token, mintStore;       //contracts
    let owner, addr1, addr2; 	//accounts
    
    function priceForTokens(count) {
        return ethers.utils.parseEther((constants.STORE_TOKEN_PRICE * count).toString()); 
    }

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        //contract
        token = await deploy.deployToken();
        mintStore = await deploy.deployMintStore(token.address);
        
        await token.setDesignatedMinter(mintStore.address);
    }); 

    describe("Initial State", function () {
        it("initial property values", async function () {
            expect(await mintStore.price()).to.equal(ethers.utils.parseEther(constants.STORE_TOKEN_PRICE.toString())); 
            expect(await mintStore.token()).to.equal(token.address);
            expect(await mintStore.totalPurchased()).to.equal(0);
        });
    });

    describe("Buy Tokens", function () {
        it("whitelisted user can purchase", async function () {
            await token.addWhitelist(addr1.address);
            const quantity = 3; 
            
            await mintStore.connect(addr1).buyTokens(quantity, { value: priceForTokens(quantity) });

            expect(await provider.getBalance(mintStore.address)).to.equal(priceForTokens(quantity));
            expect(await token.balanceOf(addr1.address)).to.equal(quantity);
            expect(await token.totalSupply()).to.equal(constants.INITIAL_SUPPLY + quantity);
            expect(await mintStore.totalPurchased()).to.equal(quantity);
        });

        it("non-whitelisted user can purchase", async function () {
            await token.removeWhitelist(addr1.address); 
            const quantity = 3; 
            
            await mintStore.connect(addr1).buyTokens(quantity, { value: priceForTokens(quantity) });

            expect(await provider.getBalance(mintStore.address)).to.equal(priceForTokens(quantity));
            expect(await token.balanceOf(addr1.address)).to.equal(quantity);
            expect(await token.totalSupply()).to.equal(constants.INITIAL_SUPPLY + quantity);
            expect(await mintStore.totalPurchased()).to.equal(quantity);
        });

        it("user can't buy tokens if price is insufficient", async function () {
            await expectRevert(
                () => mintStore.connect(addr1).buyTokens(3, { value: priceForTokens(2) }), 
                constants.errorMessages.INSUFFICIENT_AMOUNT, [
                    priceForTokens(3), 
                    priceForTokens(2)
                ]
            );
        });
        
        it("buying won't work if store is not set as designated minter", async function () {
            await token.setDesignatedMinter(constants.ZERO_ADDRESS); 
            await expectRevert(
                () => mintStore.connect(addr1).buyTokens(1, { value: priceForTokens(1)}), 
                constants.errorMessages.UNAUTHORIZED_MINTER
            ); 
        });
    });

    describe("Withdraw", function () {
        it("owner can withdraw funds", async function () {
            await mintStore.connect(addr1).buyTokens(3, { value: priceForTokens(3) });
            expect(await provider.getBalance(mintStore.address)).to.equal(priceForTokens(3)); 
            
            await mintStore.withdraw(priceForTokens(2));
            expect(await provider.getBalance(mintStore.address)).to.equal(priceForTokens(1)); 
        });

        it("non-owner cannot withdraw funds", async function () {
            await expectRevert(
                () => mintStore.connect(addr1).withdraw(1),
                constants.errorMessages.OWNER_ONLY
            ); 
        });

        it("cannot withdraw more than balance", async function () {
            await mintStore.connect(addr1).buyTokens(3, { value: priceForTokens(3) });
            expect(await provider.getBalance(mintStore.address)).to.equal(priceForTokens(3));

            await expectRevert( 
                () => mintStore.withdraw(priceForTokens(3)+1), 
                constants.errorMessages.INSUFFICIENT_AMOUNT, [
                    priceForTokens(3)+1, 
                    priceForTokens(3)
                ]
            );
        });

        it("failure to withdraw", async function () {
            //deploy nonpayable contract 
            const nonPayable = await deploy.deployNonPayable(); 
            
            //transfer ownership to it 
            await mintStore.transferOwnership(nonPayable.address); 
            
            //deposit some funds in the store 
            await mintStore.connect(addr1).buyTokens(3, { value: priceForTokens(3) });
            
            //have the new owner try to withdraw funds; should revert with FailedWithdraw
            await expectRevert(
                () => nonPayable.tryWithdrawFunds(mintStore.address), 
                constants.errorMessages.FAILED_TO_WITHDRAW
            ); 
        });
    });

    describe("Events", function () {
        it("withdrawing emits Withdrawal", async function () {
            await mintStore.connect(addr1).buyTokens(3, { value: priceForTokens(3) });

            await expectEvent(
                () => mintStore.withdraw(priceForTokens(3)),
                "Withdrawal", [
                    priceForTokens(3)
                ]
            ); 
        });

        it("purchasing emits TokenPurchase", async function () {
            await mintStore.connect(addr1).buyTokens(3, { value: priceForTokens(3) });

            await expectEvent(
                () => mintStore.connect(addr1).buyTokens(3, { value: priceForTokens(3) }),
                "TokenPurchase", [
                    addr1.address,
                    3
                ]
            );
        });
    })
});