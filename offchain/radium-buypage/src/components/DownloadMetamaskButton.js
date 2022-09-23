import { React } from 'react';

/**
 * Displays the button to download metamask (if not detected). 
 * 
 * @param {*} props 
 */
export function DownloadMetamaskButton(props) {

    return (
        <div>
            <a href="https://metamask.io/download/" target="_blank">
                <img
                    style={{ width: '200px' }}
                    onMouseOver={(e) => e.currentTarget.src = `${process.env.PUBLIC_URL}/images/metamask_over.png`}
                    onMouseOut={(e) => e.currentTarget.src = `${process.env.PUBLIC_URL}/images/metamask_off.png`}
                    src={`${process.env.PUBLIC_URL}/images/metamask_off.png`}
                />
            </a>
        </div>
    );
}