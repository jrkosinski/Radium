const { expect } = require("chai");
const { isArray } = require("lodash");

/**
 * Verifies that an event was fired and that the values associated with the event are as 
 * expected. 
 * @param {lambda} funcCall A remote call that should trigger the event.  
 * @param {string} eventName The name of the event expected. 
 * @param {array} expectedValues (optional) Array of values expected to be associated 
 * with the event.
 */
async function expectEvent(funcCall, eventName, expectedValues) {
    //call the remote function 
    const tx = await funcCall();
    const rc = await tx.wait();
    
    //expect that the event was fired
    const evt = rc.events.find(event => event.event === eventName);
    
    expect(evt.args).to.not.be.undefined; 

    //expect the expected values 
    if (expectedValues && expectedValues.length) {
        for (let n = 0; n < expectedValues.length; n++) {
            expect(evt.args[n]).to.equal(expectedValues[n]);
        }
    }
}

/**
 * Verifies that the specified event was NOT fired by the transaction. 
 * @param {lambda} funcCall A remote call that should trigger the event.  
 * @param {string} eventName The name of the event not expected. 
 */
async function expectNoEvent(funcCall, eventName) {
    //call the remote function 
    const tx = await funcCall();
    const rc = await tx.wait();

    //expect that the event was fired
    const evt = rc.events.find(event => event.event === eventName);

    expect(evt).to.be.undefined;
}

/**
 * Verifies that a smart contract call that is expected to revert, reverts with the 
 * expected error message. 
 * @param {lambda} funcCall A smart contract call that is expected to revert
 * @param {string} revertMessage The expected revert message from the transaction (optional)
 */
async function expectRevert(funcCall, revertMessage, params) {
    if (revertMessage) {
        if (params && isArray(params)) {
            let paramsString = "";
            params.forEach(e => {
                if (paramsString.length) 
                    paramsString += ", ";
                paramsString += e; 
            });
            revertMessage += `(${paramsString})`;
        }
        await expect(
            funcCall()
        ).to.be.revertedWith(revertMessage); 
    } 
    else {
        await expect(
            funcCall()
        ).to.be.reverted; 
    }
}

module.exports = {
    expectEvent,
    expectNoEvent,
    expectRevert
};