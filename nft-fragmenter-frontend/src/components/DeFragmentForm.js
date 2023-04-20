import React, { useState } from 'react';
import axios from 'axios';
import useMetaMask from '../hooks/useMetaMask';
import { ethers } from 'ethers';

const FragmentForm = () => {
    const { provider: metaMaskProvider, address } = useMetaMask();
    const [tokenId, setTokenId] = useState('');
    const [status, setStatus] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Processing...');
        if (!metaMaskProvider) {
            setStatus('Error: MetaMask provider not available');
            return;
        }

        const provider = new ethers.providers.Web3Provider(metaMaskProvider);

        try {
            const signature = await provider.send('personal_sign', ['Defragment this NFT ' + tokenId.toString(), address]);


            const response = await axios.post('/api/nft/defragment', { tokenId, address, signature });
            const tx = response.data.transaction;

            // Convert BigNumber properties to hex strings
            const gasLimit = tx.gasLimit ? tx.gasLimit.toHexString() : undefined;
            const gasPrice = tx.gasPrice ? tx.gasPrice.toHexString() : undefined;
            const value = tx.value ? tx.value.toHexString() : undefined;

            const transactionHash = await provider.send('eth_sendTransaction', [{
                from: address,
                to: tx.to,
                data: tx.data,
                gas: gasLimit,
                gasPrice: gasPrice,
                value: value,
                nonce: tx.nonce,
            }]);

            setStatus(`Transaction: ${transactionHash}`);
        } catch (error) {
            console.log(error)
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Defragment NFT</h2>
            <form onSubmit={handleSubmit}>

                <label htmlFor="tokenId">Token ID:</label>
                <input
                    type="number"
                    id="tokenId"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    required
                />
                <br />

                <button type="submit">Defragment</button>
            </form>
            <p>{status}</p>
        </div>
    );
};

export default FragmentForm;
