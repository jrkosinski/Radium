const commandData = require('./commandData')

const CommandStack = require('./CommandStack');

module.exports = {
    CommandStack, 
    processInput: (
        text, 
        input, 
        key, 
        setTextFunc, 
        setStatusMsgFunc, 
        setErrorMsgFunc, 
        setProcessingFunc,
        commandStack
    ) => {
        
        //adjust text to remove prompt
        text = text.substring(2);
        
        //set command line text 
        const setCmdText = (s) => {
            setTextFunc("> " + s);
        }
        
        //set status message text 
        const setStatusMsg = (s) => {
            setStatusMsgFunc(s);
        }

        //set error message text 
        const setErrorMsg = (s) => {
            setErrorMsgFunc(s);
        }
        
        //exit application 
        const exit = () => {
            setCmdText("");
            setStatusMsg("bye!");
            process.exit();
        }
        
        //show help 
        const showHelp = () => {
            setCmdText("");
            let helpText = "commands: \n quit\n help";
            for (cmd in commandData) {
                let argsList = "";
                commandData[cmd].args.forEach(arg => {
                    argsList += ` <${arg}>`
                });
                helpText += `\n ${cmd} ${argsList}`;
            }
            setStatusMsg(helpText);
        }

        //main input processing
        const processInput = async (value) => {
            try {
                if (commandStack) 
                    commandStack.push(value);
                
                //split input into words 
                const words = value.split(' ');
                for(let n=words.length-1; n>=0; n--) {
                    words[n] = words[n].trim(); 
                    if (words[n].length == 0) 
                        words.splice(n,1);  
                }
                const first = words[0].toLowerCase().trim();
                
                setErrorMsg(""); 
                
                //quit 
                if (first == "quit" || first == "q" || first == "exit" || first == "bye") {
                    exit();
                }

                //help 
                if (first == "help" || first == "h" || first == "?") {
                    showHelp();
                    return;
                }

                //other commands 
                const command = commandData[first];
                if (command) {
                    //wrong number of arguments 
                    if (words.length < (command.args.length + 1)) {
                        let helpText = first;
                        command.args.forEach(s => {
                            helpText += ` <${s}>`;
                        });
                        setStatusMsg(helpText);
                    } else {
                        //execute command 
                        setStatusMsg("processing...");
                        setProcessingFunc(true);
                        const response = await command.function(words.slice(1));
                        
                        setStatusMsg(response ? response : '...completed');
                        setProcessingFunc(false);
                    }
                } 
                else {
                    //unknown command 
                    setStatusMsg(`'${first}' unknown command`);
                }
            }
            catch (err) {
                setStatusMsg("an error occurred");
                setErrorMsg(err.message);
                setProcessingFunc(false);
            }
            setCmdText("");
        }

        
        //ENTER / RETURN 
        if (key.return) {
            let t = text;
            processInput(t);
        }

        //TAB 
        else if (key.tab) {
            //TODO: autocomplete
        }

        //BACKSPACE 
        else if (key.delete) {
            setCmdText(text.substring(0, text.length - 1));
        }

        //UP ARROW 
        else if (key.upArrow) {
            if (commandStack) 
                setCmdText(commandStack.prev());
        }

        //DOWN ARROW 
        else if (key.downArrow) {
            if (commandStack) 
                setCmdText(commandStack.next());
        }

        //ANY OTHER KEY 
        else {
            setCmdText(text + input);
        }
    }
}