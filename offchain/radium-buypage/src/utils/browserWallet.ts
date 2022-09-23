
export function isBrowserWalletInstalled(): Boolean {
    const ethereum: any = (window as any).ethereum;
    return Boolean(ethereum);
}

export async function connectBrowserWallet(): Promise<String> {
    const ethereum: any = (window as any).ethereum;
    let output: String = "";
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