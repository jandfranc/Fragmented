import { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { NETWORKS } from '@metamask/providers';

const useMetaMask = () => {
    const [provider, setProvider] = useState(null);
    const [address, setAddress] = useState('');

    useEffect(() => {
        const detectProvider = async () => {
            const provider = await detectEthereumProvider();

            if (provider) {
                const chainId = await provider.request({ method: 'eth_chainId' });
                console.log(chainId)
                if (chainId !== '0x13881') {
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x13881' }],
                    });
                }

                setProvider(provider);
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                setAddress(accounts[0]);
            } else {
                console.error('Please install MetaMask');
            }
        };

        detectProvider();
    }, []);

    return { provider, address };
};

export default useMetaMask;
