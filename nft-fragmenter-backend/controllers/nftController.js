const { ethers } = require('ethers');
const { InfuraProvider } = require('@ethersproject/providers');

const NFTFragmenter = require('../contracts/NFTFragmenter.json');

const infuraProjectId = process.env.INFURA_PROJECT_ID;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new InfuraProvider(80001, infuraProjectId);


const contract = new ethers.Contract(contractAddress, NFTFragmenter.abi, provider);

exports.fragmentNFT = async (req, res) => {
    try {
        const { nftContract, tokenId, fragmentsCount, address, signature } = req.body;


        const signer = ethers.utils.verifyMessage('Fragment this nft: ' + tokenId.toString(), signature);


        if (signer.toLowerCase() !== address.toLowerCase()) {
            return res.status(400).json({ error: "Invalid signer" });
        }

        const tx = await contract.populateTransaction.fragmentNFT(nftContract, tokenId, fragmentsCount);

        res.status(200).json({ transaction: tx });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

exports.defragmentNFT = async (req, res) => {
    try {

        const { tokenId, address, signature } = req.body;


        const signer = ethers.utils.verifyMessage('Defragment this NFT ' + tokenId.toString(), signature);


        if (signer.toLowerCase() !== address.toLowerCase()) {
            return res.status(400).json({ error: "Invalid signer" });
        }

        const tx = await contract.populateTransaction.defragmentNFT(tokenId);

        res.status(200).json({ transaction: tx });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
};