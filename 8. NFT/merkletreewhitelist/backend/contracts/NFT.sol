// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title Alyra
 * @dev Contrat NFT ERC721 avec whitelist basée sur un arbre de Merkle
 * Chaque adresse whitelistée peut minter un seul NFT
 */
contract Alyra is ERC721, ERC721Enumerable, Ownable {
    // Compteur pour générer les IDs de tokens de manière séquentielle
    uint256 private _nextTokenId;

    // Racine de l'arbre de Merkle pour la whitelist
    bytes32 public merkleRoot;

    // Mapping pour suivre les adresses qui ont déjà minté
    mapping(address => bool) public hasMinted;

    /**
     * @dev Constructeur du contrat
     * @param initialOwner Adresse du propriétaire initial du contrat
     * @param _merkleRoot Racine de l'arbre de Merkle pour la whitelist
     */
    constructor(address initialOwner, bytes32 _merkleRoot)
        ERC721("Alyra", "ALY")
        Ownable(initialOwner)
    {
        merkleRoot = _merkleRoot;
    }

    /**
     * @dev Permet de minter un NFT si l'appelant est whitelisté et n'a pas encore minté
     * @param to Adresse qui recevra le NFT
     * @param _proof Preuve de Merkle pour vérifier que l'appelant est whitelisté
     */
    function safeMint(address to, bytes32[] calldata _proof) public {
        require(isWhitelisted(msg.sender, _proof), "Not Whitelisted");
        require(!hasMinted[msg.sender], "Already minted");
        hasMinted[msg.sender] = true;
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    /**
     * @dev Permet au propriétaire de modifier la racine de l'arbre de Merkle
     * @param _merkleRoot Nouvelle racine de l'arbre de Merkle
     */
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    /**
     * @dev Vérifie si une adresse est whitelistée en utilisant une preuve de Merkle
     * @param _account Adresse à vérifier
     * @param _proof Preuve de Merkle
     * @return bool True si l'adresse est whitelistée, false sinon
     */
    function isWhitelisted(address _account, bytes32[] calldata _proof) internal view returns(bool) {
        // Calcul de la feuille de l'arbre (double hashage pour correspondre à StandardMerkleTree)
        bytes32 leaf = keccak256(abi.encode(keccak256(abi.encode(_account))));
        return MerkleProof.verify(_proof, merkleRoot, leaf);
    }

    // ========================================================================
    // RÉSOLUTION DES CONFLITS D'HÉRITAGE MULTIPLE
    // ========================================================================

    /**
     * @dev Ces trois fonctions sont nécessaires pour résoudre le "Diamond Problem"
     * en Solidity lors de l'héritage multiple.
     *
     * Le problème : Notre contrat hérite de ERC721 ET ERC721Enumerable.
     * ERC721Enumerable hérite lui-même de ERC721. Cela crée une hiérarchie en diamant :
     *
     *           ERC721
     *          /      \
     *        /          \
     *   ERC721      ERC721Enumerable
     *        \          /
     *         \        /
     *           Alyra
     *
     * Les deux contrats (ERC721 et ERC721Enumerable) implémentent les mêmes fonctions
     * (_update, _increaseBalance, supportsInterface) mais avec des logiques différentes.
     *
     * Sans ces overrides, le compilateur Solidity ne saurait pas quelle version utiliser
     * et générerait une erreur de compilation.
     */

    /**
     * @dev Override de _update pour gérer les transferts de NFT
     *
     * Cette fonction est appelée à chaque mint, burn ou transfert de token.
     *
     * - ERC721._update : Gère la logique de base du transfert (propriété, approbations)
     * - ERC721Enumerable._update : Ajoute la logique de suivi pour l'énumération
     *   (maintient des listes de tous les tokens et tokens par propriétaire)
     *
     * En spécifiant override(ERC721, ERC721Enumerable), on indique explicitement
     * au compilateur qu'on surcharge les deux versions.
     *
     * super._update() appelle les deux implémentations parentes dans l'ordre de la
     * hiérarchie d'héritage, garantissant que toute la logique est exécutée.
     *
     * @param to Adresse du destinataire (address(0) pour burn)
     * @param tokenId ID du token à transférer
     * @param auth Adresse autorisée à effectuer le transfert
     * @return Adresse du propriétaire précédent
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Override de _increaseBalance pour gérer le compteur de tokens par adresse
     *
     * Cette fonction interne est appelée pour incrémenter le nombre de NFTs
     * possédés par une adresse.
     *
     * - ERC721._increaseBalance : Met à jour le simple compteur de balance
     * - ERC721Enumerable._increaseBalance : Met aussi à jour les structures d'énumération
     *   qui permettent de lister tous les tokens d'un propriétaire
     *
     * Encore une fois, super._increaseBalance() garantit que les deux logiques
     * sont exécutées correctement.
     *
     * @param account Adresse dont on incrémente le solde
     * @param value Montant à ajouter au solde (généralement 1 pour un NFT)
     */
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    /**
     * @dev Override de supportsInterface pour l'introspection ERC165
     *
     * ERC165 est un standard qui permet de vérifier quelles interfaces un contrat
     * implémente. C'est utilisé par les wallets et marketplaces pour savoir comment
     * interagir avec le contrat.
     *
     * - ERC721.supportsInterface : Retourne true pour les interfaces ERC721 et ERC165
     * - ERC721Enumerable.supportsInterface : Retourne true pour l'interface ERC721Enumerable
     *
     * En combinant les deux avec super.supportsInterface(), on s'assure que le contrat
     * déclare correctement supporter toutes les interfaces :
     * - IERC165 (0x01ffc9a7)
     * - IERC721 (0x80ac58cd)
     * - IERC721Metadata (0x5b5e139f)
     * - IERC721Enumerable (0x780e9d63)
     *
     * @param interfaceId Identifiant de 4 bytes de l'interface (selon ERC165)
     * @return bool True si le contrat implémente cette interface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}