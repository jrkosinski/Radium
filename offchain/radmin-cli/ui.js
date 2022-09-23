// ui.js

const React = require('react');
const { Text } = require('ink');
const { useState } = React;
const { useInput } = require('ink');
const Gradient = require('ink-gradient');
const BigText = require('ink-big-text');
const importJsx = require('import-jsx');
const Table = importJsx('./components/Table');
const Spinner = importJsx('./components/Spinner'); 
const {processInput, CommandStack} = require('./utils/inputProcessor');

const App = () => {
    const [text, setText] = useState("> ");
    const [processing, setProcessing] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");  //TODO: use error msg
    const [commandStack, setCommandStack] = useState(new CommandStack()); 
    
    useInput(async (input, key) => {
        if (processing) 
            return;
        
        await processInput(text, input, key, setText, 
            setStatusMsg, setErrorMsg, setProcessing,
            commandStack
        );   
    });
    
    return (
        <>
            <Gradient name="summer">
                <BigText
                    text="RADIUM"
                    align='left'
                    font='chrome'
                />
            </Gradient>
            <Table />
            <Text>{text}</Text>
            <Text color="blue"><Spinner visible={processing} /> {statusMsg}</Text>
            <Text color="red">{errorMsg}</Text>
        </>
    );
}

module.exports = App;