import './App.css';
import { connectBrowserWallet, isBrowserWalletInstalled } from './utils/browserWallet';
import { React, useState, useEffect } from 'react';
import { ethers} from 'ethers';
import { QuantitySelect } from './components/QuantitySelect';
import { DownloadMetamaskButton } from './components/DownloadMetamaskButton';
import { ConnectMetamaskButton } from './components/ConnectMetamaskButton';
import ContractApi from './contracts/contractApi'; 


function App() {
    //is an ethereum wallet available 
    const [walletInstalled, setWalletInstalled] = useState(false);
    
    //browser wallet address 
    const [walletAddress, setWalletAddress] = useState("");
    
    //login in progress 
    const [walletLoginInProgress, setWalletLoginInProgress] = useState(false);
    
    //connected wallet's BAD token balance 
    const [tokenQuantity, setTokenQuantity] = useState("");
    
    //price per token, from contract 
    const [tokenPrice, setTokenPrice] = useState("");
    
    //quantity selected to purchase 
    const [quantitySelected, setQuantitySelected] = useState(0);
    
    //connected to wallet 
    const [connected, setConnected] = useState(false);
    
    const contractApi = new ContractApi(); 
    
    /**
     * Attempt to connect to ethereum browser. 
     */
    async function doWalletLogin() {
        if (!isBrowserWalletInstalled()) {
            console.log('browser wallet not found or not installed');
            setWalletInstalled(false);
        }
        else {
            console.log('wallet found');
            setWalletInstalled(true); 
            
            //atttempt to connect to wallet 
            setWalletLoginInProgress(true);
            console.log('opening browser wallet...');
            const account = await connectBrowserWallet();
            
            setWalletLoginInProgress(false);
            
            //if connected successfully, proceed to next steps
            if (account && account.length) {
                setWalletAddress(account.toString());
                console.log(account.toString());

                await contractApi.init();
                setTokenPrice(ethers.utils.formatEther(contractApi.tokenPrice.toString()));
                setTokenQuantity(contractApi.balance.toString());
                setConnected(true);
                
                //allow for account and chain changing 
                const onAccountsChanged = () => {
                    console.log('accounts changed wallet'); 
                    doWalletLogin(); 
                }; 
                
                window.ethereum.removeListener("accountsChanged", onAccountsChanged);
                window.ethereum.removeListener("chainChanged", onAccountsChanged); 
                window.ethereum.on("accountsChanged", onAccountsChanged);
                window.ethereum.on("chainChanged", onAccountsChanged); 
                
                //allow for disconnect
                const onDisconnected = () => {
                    console.log('disconnected wallet'); 
                    setConnected(false); 
                };
                window.ethereum.removeListener("disconnect", onDisconnected); 
                window.ethereum.on("disconnect", onDisconnected); 
            }
        }
    }

    /**
     * Onload, call function to attempt wallet login.
     */
    useEffect(() => {
        const onLoad = async () => {
            await doWalletLogin();
        };
        window.addEventListener("load", onLoad);

        return () => { window.removeEventListener("load", onLoad); }
    }, []); 

    /**
     * User purchases tokens from token store using connected wallet.
     */
    async function buyTokens() {
        await contractApi.init(); 
        await contractApi.buyTokens(quantitySelected); 
        await contractApi.refreshBalance();
        
        setTokenQuantity(contractApi.balance.toString());
    }
    
    return (
        <div className="App App-header">
            <p className="sub-text">
                {connected && 
                'connected: rinkeby'
                }
            </p>
            <div className="big-panel">
                <br/>
                <div style={{ verticalAlign: "top" }} className="header-text gradient-text">
                    RADIUM<br/>
                    <img height="100" src='/images/radium-logo.png' alt="art by Mina Kosinski, age 8" />
                </div>
                {!walletInstalled &&
                    <DownloadMetamaskButton />
                }

                {walletInstalled && !connected &&
                    <div >
                        <ConnectMetamaskButton disabled={walletLoginInProgress} onClick={() => doWalletLogin()} />
                    </div>
                }

                {connected &&
                    <div>
                        <p style={{ fontSize: '16px' }} >
                            your balance: <span style={{fontWeight:'bold'}} className="gradient-text">{tokenQuantity}</span>
                        </p>
                        <p className="sub-text">
                            price per token: <span style={{ fontWeight: 'bold' }}>{tokenPrice} eth</span>
                        </p>
                        <QuantitySelect state={quantitySelected} setState={setQuantitySelected} />

                        <button className="cta-button mint-button" disabled={quantitySelected == 0} onClick={() => buyTokens()}>
                            Buy {quantitySelected} for {Math.round(parseFloat(tokenPrice) * quantitySelected * 10000) / 10000} ETH
                        </button>
                    </div>
                }
            </div>
            <p className="sub-text">{connected && walletAddress}</p>
        </div>
    );
}

export default App;
