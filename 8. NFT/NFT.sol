// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTAlyra is ERC721A, Ownable {
    uint256 private constant MAX_SUPPLY = 32;
    uint256 private constant PRICE_PER_NFT = 1 ether;
    uint256 private constant AMOUNT_NFT_PER_WALLET = 2;
    string public baseURI = "ipfs://bafybeicdgx2rh7djzb23ejjwoq7g6gvjlus556b7mrzcfspxfffes3cw2i/";
    using Strings for uint;

    mapping(address => uint256) amountNftMintedPerWallet;

    constructor() ERC721A("Alyra", "ALY") Ownable(msg.sender) {

    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function mint(uint256 _quantity) external payable {
        // checker si l'utilisateur n'essaie pas de minter trop de nfts (max 2 par wallet)
        require(amountNftMintedPerWallet[msg.sender] + _quantity <= AMOUNT_NFT_PER_WALLET, "Max limit per Wallet");
        require(totalSupply() + _quantity <= MAX_SUPPLY, "Max supply exceeded");
        //require(msg.value >= PRICE_PER_NFT * _quantity, "Insufficient funds");
        amountNftMintedPerWallet[msg.sender] += _quantity;
        _safeMint(msg.sender, _quantity);
    }
    //totalSupply() => de récupérer le nombre de NFT minté sans cette collection

    function tokenURI(uint _tokenId) public view virtual override(ERC721A) returns(string memory) {
        require(_exists(_tokenId), "URI query for non existent token");
        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }
}