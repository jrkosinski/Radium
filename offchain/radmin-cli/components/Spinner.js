// Table.js

const React = require('react');
const spinners = require('cli-spinners'); 
const { Text } = require('ink');
const { useState, useEffect } = React;

const Spinner = ({ type = 'dots', visible="false" }) => {

    let [spinnerCount, setSpinner] = useState(1);
    let frames = spinners[type].frames; //['|', '/', '--', '\\']; 

    useEffect(() => {
        let timer = setInterval(async () => {
            if (visible) {
                if (spinnerCount >= frames.length - 1)
                    spinnerCount = 0;
                else
                    spinnerCount++;
                setSpinner(spinnerCount); 
            }
        }, 250);

        return () => {
            clearInterval(timer);
        };
    });

    return (
        <>{visible ? frames[spinnerCount] : ''}</>
    )
}

module.exports = Spinner;