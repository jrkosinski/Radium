import '../App.css'; 
import { React } from 'react'; 

/**
 * Displays the control to increase and decrease a displayed positive integer quantity. 
 * 
 * @param {{state:number}} props 
 */
export function QuantitySelect(props) {
    
    function increment() {
        props.setState(props.state+1);
    }
    function decrement() {
        props.setState(props.state > 0 ? props.state - 1 : 0);
    }
    
    return <p>
        <span>
            <button 
                className="cta-button arrow-button gradient-text" 
                onClick={() => decrement()}>&lt;
            </button>
        </span>
        <span className="cta-button connect-wallet-button">{props.state}</span>
        <span>
            <button 
                className="cta-button arrow-button gradient-text"  
                onClick={() => increment()}>&gt;
            </button>
        </span>
    </p>
}