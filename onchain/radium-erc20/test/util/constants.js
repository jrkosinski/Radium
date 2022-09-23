module.exports = {

    //token details 
    TOKEN_CONTRACT_ID: "Radium",
    TOKEN_NAME: "Radium",
    TOKEN_SYMBOL: "RAD", 
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    INITIAL_SUPPLY: 10000000,
    
    //store 
    STORE_CONTRACT_ID: "MintStore",
    STORE_TOKEN_PRICE: 0.01,

    //if token is already deployed, put its address here 
    TOKEN_ADDRESS: "<INSERT_TOKEN_ADDRESS_HERE>",
    
    interfaceIds : {
        IERC2981:           "0x2a55205a", 
        IERC165:            "0x01ffc9a7", 
        IAccessControl:     "0x7965db0b", 
        IERC721:            "0x80ac58cd", 
        IERC721Enumerable:  "0x780e9d63", 
        IERC20:             "0x36372b07", 
        IERC20Metadata:     "0xa219a025", 
        IERC777:            "0xe58e113c"
    }, 
    
    errorMessages: {
        OWNER_ONLY: "Ownable: caller is not the owner", 
        BURN_EXCEEDED: "AmountExceedsBalance", 
        INSUFFICIENT_ALLOWANCE: "InsufficientAllowance", 
        TRANSFER_EXCEEDS_BALANCE: "AmountExceedsBalance", 
        UNAUTHORIZED_MINTER: "NotAuthorizedToMint",
        INSUFFICIENT_AMOUNT: "InsufficientAmount", 
        NOT_WHITELISTED: "NotWhitelisted",
        FAILED_TO_WITHDRAW: "FailedWithdraw" ,
        PAUSED: "Pausable: paused",
        NOT_PAUSED: "Pausable: not paused"
    }
};
