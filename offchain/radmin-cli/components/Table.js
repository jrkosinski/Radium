// Table.js

const React = require('react');
const { useState, useEffect } = React;
const Gradient = require('ink-gradient');
const importJsx = require('import-jsx');
const Spinner = importJsx('./Spinner');
const { Box, Text, Newline } = require('ink');
const ContractApi = require('../contracts/contractApi');

const Table = () => {

    const [balance, setBalance] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [storeRevenue, setStoreRevenue] = useState(0);
    const [whitelistCount, setWhitelistCount] = useState(0);
    const [walletAddress, setWalletAddress] = useState("");
    const [testBalance1, setTestBalance1] = useState({});
    const [testBalance2, setTestBalance2] = useState({});
    const [testBalance3, setTestBalance3] = useState({});
    const [testBalance4, setTestBalance4] = useState({});
    const [totalMinted, setTotalMinted] = useState(0);
    const [totalPurchased, setTotalPurchased] = useState(0);
    const [paused, setPaused] = useState(false);
    const [initRunning, setInitRunning] = useState(false);
    const [firstRun, setFirstRun] = useState(true); 
    
    const stateHolder = {
        setBalance, 
        setTotalSupply,
        setStoreRevenue,
        setWhitelistCount,
        setWalletAddress,
        setPaused,
        setTestBalance1,
        setTestBalance2,
        setTestBalance3,
        setTestBalance4, 
        setTotalMinted,
        setTotalPurchased
    }

    useEffect(() => {
        if (firstRun) {
            setFirstRun(false);
            new ContractApi().init(stateHolder);
        }

        const timer = setInterval( async () => {
            if (!initRunning) {
                const contract = new ContractApi();
                
                setInitRunning(true);
                await contract.init(stateHolder);
                setInitRunning(false);
            }
        }, 3000);
        
        return () => {
            clearInterval(timer);
        };
    });

    return (
        <Box borderStyle='single' width="50%" flexDirection='column'>
            <Box>
                <Box width='200%'><Text color="green"><Spinner visible={initRunning} /> </Text></Box>
            </Box>
            {paused && 
            <Box>
                <Box width='200%'><Text color="red">CONTRACT PAUSED</Text></Box>
            </Box>
            }
            <Box>
                <Box width='200%'><Text>--- your address ---</Text></Box>
            </Box>
            <Box>
                <Box width='200%'><Gradient name="summer"><Text>{walletAddress}</Text></Gradient></Box>
            </Box>
            <Box>
                <Box width='200%'><Text>.</Text></Box>
            </Box>
            <Box>
                <Box width='200%'><Text>--- test addresses ---</Text></Box>
            </Box>
            <Box>
                <Box width='200%'>
                    <Gradient name="summer">
                        <Text>
                            {testBalance1.address} {testBalance1.balance}
                        </Text>
                    </Gradient>
                </Box>
            </Box>
            <Box>
                <Box width='200%'>
                    <Gradient name="summer">
                        <Text>
                            {testBalance2.address} {testBalance2.balance}
                        </Text>
                    </Gradient>
                </Box>
            </Box>
            <Box>
                <Box width='200%'>
                    <Gradient name="summer">
                        <Text>
                            {testBalance3.address} {testBalance3.balance}
                        </Text>
                    </Gradient>
                </Box>
            </Box>
            <Box>
                <Box width='200%'>
                    <Gradient name="summer">
                        <Text>
                            {testBalance4.address} {testBalance4.balance}
                        </Text>
                    </Gradient>
                </Box>
            </Box>
            <Box>
                <Box width='200%'><Text>.</Text></Box>
            </Box>
            <Box>
                <Box width='200%'><Gradient name="summer"><Text>total supply</Text></Gradient></Box>
                <Box width='200%'><Text>{totalSupply}</Text></Box>
            </Box>
            <Box>
                <Box width='200%'><Gradient name="summer"><Text>your balance</Text></Gradient></Box>
                <Box width='200%'><Text>{balance}</Text></Box>
            </Box>
            <Box>
                <Box width='200%'><Gradient name="summer"><Text>whitelist count</Text></Gradient></Box>
                <Box width='200%'><Text>{whitelistCount}</Text></Box>
            </Box>
            <Box>
                <Box width='200%'><Gradient name="summer"><Text>total minted</Text></Gradient></Box>
                <Box width='200%'><Text>{totalMinted}</Text></Box>
            </Box>
            <Box>
                <Box width='200%'><Gradient name="summer"><Text>total purchased</Text></Gradient></Box>
                <Box width='200%'><Text>{totalPurchased}</Text></Box>
            </Box>
            <Box>
                <Box width='200%'><Gradient name="summer"><Text>store revenue</Text></Gradient></Box>
                <Box width='200%'><Text>{storeRevenue} eth</Text></Box>
            </Box>
            <Newline />
        </Box>
    )
}

module.exports = Table;