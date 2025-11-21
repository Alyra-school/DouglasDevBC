// Import des outils nécessaires depuis Hardhat
// - ethers : bibliothèque pour interagir avec Ethereum
// - upgrades : plugin OpenZeppelin pour gérer les contrats upgradables
import { ethers, upgrades } from "hardhat";

async function main() {
    // ==================== ÉTAPE 1 : RÉCUPÉRATION DE LA FACTORY ====================
    // Récupération de la factory du contrat "Box"
    // La factory est un objet qui permet de créer des instances du contrat
    // Cette étape compile automatiquement le contrat s'il n'est pas déjà compilé
    const Box = await ethers.getContractFactory("Box");

    // ==================== ÉTAPE 2 : DÉPLOIEMENT DU PROXY ====================
    // Déploiement du contrat en utilisant le pattern Proxy (ERC-1967)
    // Ce pattern crée 2 contrats :
    //   1. Le PROXY : contient les données et ne change jamais d'adresse
    //   2. L'IMPLÉMENTATION : contient la logique et peut être remplacé
    // Avantage : on peut modifier la logique sans perdre les données ni changer l'adresse
    const boxProxy = await upgrades.deployProxy(Box);

    // Attendre que la transaction de déploiement soit confirmée sur la blockchain
    await boxProxy.waitForDeployment();

    // ==================== ÉTAPE 3 : RÉCUPÉRATION DES ADRESSES ====================
    // Obtenir l'adresse du contrat d'implémentation
    // Le standard ERC-1967 définit où stocker cette adresse dans le proxy
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(
        await boxProxy.getAddress()
    );

    // Affichage des deux adresses importantes :
    // - Proxy : l'adresse à utiliser pour interagir avec le contrat (ne change jamais)
    // - Implementation : l'adresse du contrat contenant la logique (peut changer lors d'un upgrade)
    console.log("Proxy deployed to:", await boxProxy.getAddress());
    console.log("Implementation deployed to:", implementationAddress);

    // ==================== ÉTAPE 4 : TEST DU CONTRAT ====================
    // Appel de la fonction store() pour stocker la valeur 42
    // Cet appel crée une transaction qui modifie l'état du contrat
    let transaction = await boxProxy.store(42);

    // Attendre que la transaction soit minée et confirmée sur la blockchain
    await transaction.wait();

    // Appel de la fonction retrieve() pour récupérer la valeur stockée
    // Cette fonction est "view", donc elle ne crée pas de transaction
    console.log("Value stored:", await boxProxy.retrieve());

    // Appel de la fonction version() pour vérifier la version du contrat
    let version = await boxProxy.version();
    console.log("Box version:", version);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});