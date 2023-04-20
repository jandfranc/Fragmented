import React, { useState } from 'react';
import axios from 'axios';
import useMetaMask from '../hooks/useMetaMask';
import { ethers } from 'ethers'; // Import ethers

const FragmentForm = () => {
    const { provider: metaMaskProvider, address } = useMetaMask();
    // Ensure you are using the correct provider from ethers

    const [nftContract, setNftContract] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [fragmentsCount, setFragmentsCount] = useState('');
    const [status, setStatus] = useState('');

    const fragmenterContractAddress = '0xFe622C50993F0B96A07eDBDD6abC0dC39fC2e585';


    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Processing...');
        if (!metaMaskProvider) {
            setStatus('Error: MetaMask provider not available');
            return;
        }

        const provider = new ethers.providers.Web3Provider(metaMaskProvider);

        try {
            // Approve the fragmenter contract to transfer the NFT on behalf of the user
            const nftContractInstance = new ethers.Contract(nftContract, ['function approve(address to, uint256 tokenId)'], provider.getSigner());
            const approveTx = await nftContractInstance.approve(fragmenterContractAddress, tokenId);

            // Wait for the approve transaction to be confirmed
            await provider.waitForTransaction(approveTx.hash);
            const signature = await provider.send('personal_sign', ['Fragment this nft: ' + tokenId.toString(), address]);


            const response = await axios.post('/api/nft/fragment', { nftContract, tokenId, fragmentsCount, address, signature });
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
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Fragment NFT</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="nftContract">NFT Contract:</label>
                <input
                    type="text"
                    id="nftContract"
                    value={nftContract}
                    onChange={(e) => setNftContract(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="tokenId">Token ID:</label>
                <input
                    type="number"
                    id="tokenId"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="fragmentsCount">Fragments Count:</label>
                <input
                    type="number"
                    id="fragmentsCount"
                    value={fragmentsCount}
                    onChange={(e) => setFragmentsCount(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Fragment</button>
            </form>
            <p>{status}</p>
        </div>
    );
};

export default FragmentForm;
