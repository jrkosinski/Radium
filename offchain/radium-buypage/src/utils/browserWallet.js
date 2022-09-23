
export function isBrowserWalletInstalled() {
    const ethereum = (window).ethereum;
    return Boolean(ethereum && ethereum.isMetaMask);
}

export async function connectBrowserWallet(){
    const ethereum = (window).ethereum;
    let output = "";
    try {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        output = accounts[0];
    } catch (error) {
        console.error(error);
        output = "";
    }

    return output;
}