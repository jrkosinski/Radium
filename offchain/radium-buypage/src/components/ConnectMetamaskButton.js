import { React } from 'react';

/**
 * Displays the button to connect initially to metamask. 
 * Can be disabled via props. 
 * 
 * @param {{disabled:bool}} props 
 */
export function ConnectMetamaskButton(props) {

    return (
        <div>
            <img
                style={{ width: '200px' }}
                onMouseOver={(e) => {
                    if (!props.disabled) 
                        e.currentTarget.src = `${process.env.PUBLIC_URL}/images/metamask_over.png`
                    }
                }
                onMouseOut={(e) => e.currentTarget.src = `${process.env.PUBLIC_URL}/images/metamask_off.png`}
                src={`${process.env.PUBLIC_URL}/images/metamask_off.png`}
                onClick={() => {
                    if (!props.disabled) 
                        props.onClick();
                }}
            />
        </div>
    );
}