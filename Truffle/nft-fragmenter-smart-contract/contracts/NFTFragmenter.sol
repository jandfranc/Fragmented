// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTFragmenter is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;

    struct FragmentedNFT {
        uint256 originalTokenId;
        address originalContract;
        uint256 fragmentsCount;
    }

    mapping(uint256 => FragmentedNFT) public fragmentedNFTs;

    event NFTFragmented(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 fragmentsCount
    );
    event NFTDefragmented(address indexed owner, uint256 indexed tokenId);

    constructor() ERC1155("") {}

    function fragmentNFT(
        address nftContract,
        uint256 tokenId,
        uint256 fragmentsCount
    ) public {
        require(fragmentsCount > 0, "Fragments count should be greater than 0");

        IERC721 nft = IERC721(nftContract);
        require(
            nft.ownerOf(tokenId) == msg.sender,
            "Caller is not the owner of the NFT"
        );

        // Transfer the original NFT to this contract
        nft.transferFrom(msg.sender, address(this), tokenId);

        // Create the fragmented NFT
        uint256 newTokenId = _tokenIdTracker.current();
        fragmentedNFTs[newTokenId] = FragmentedNFT(
            tokenId,
            nftContract,
            fragmentsCount
        );
        _tokenIdTracker.increment();

        // Mint fragments as ERC1155 tokens
        _mint(msg.sender, newTokenId, fragmentsCount, "");

        emit NFTFragmented(msg.sender, tokenId, fragmentsCount);
    }

    function defragmentNFT(uint256 tokenId) public {
        FragmentedNFT memory fragmentedNFT = fragmentedNFTs[tokenId];
        require(
            fragmentedNFT.originalContract != address(0),
            "Invalid tokenId"
        );

        // Check if the caller owns all the fragments
        uint256 fragmentsCount = fragmentedNFT.fragmentsCount;
        require(
            balanceOf(msg.sender, tokenId) == fragmentsCount,
            "Caller does not own all fragments"
        );

        // Burn fragments
        _burn(msg.sender, tokenId, fragmentsCount);

        // Transfer the original NFT back to the owner
        IERC721(fragmentedNFT.originalContract).transferFrom(
            address(this),
            msg.sender,
            fragmentedNFT.originalTokenId
        );

        emit NFTDefragmented(msg.sender, tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        // Implement custom logic for generating metadata URI for fragmented NFTs
    }
}
