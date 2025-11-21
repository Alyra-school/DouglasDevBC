// Import des outils nécessaires depuis Hardhat
// - ethers : bibliothèque pour interagir avec Ethereum
// - upgrades : plugin OpenZeppelin pour gérer les contrats upgradables
import { ethers, upgrades } from "hardhat";

// ==================== ADRESSE DU PROXY EXISTANT ====================
// Cette adresse est celle du PROXY déployé précédemment avec deploy.ts
// IMPORTANT : Le proxy conserve toujours la même adresse, seule l'implémentation change
// Remplacez cette adresse par celle affichée lors du déploiement initial
const proxyAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
    // ==================== ÉTAPE 1 : RÉCUPÉRATION DE LA NOUVELLE FACTORY ====================
    // Récupération de la factory du contrat "BoxV2" (la nouvelle version)
    // BoxV2 contient des améliorations par rapport à Box (par exemple, la fonction increment())
    // Cette étape compile automatiquement le nouveau contrat
    const BoxV2 = await ethers.getContractFactory("BoxV2");

    // ==================== ÉTAPE 2 : MISE À JOUR DU PROXY ====================
    // Mise à jour du contrat : le proxy va maintenant pointer vers BoxV2
    // Ce qui se passe en interne :
    //   1. Déploiement du nouveau contrat BoxV2 (nouvelle implémentation)
    //   2. Le proxy met à jour sa référence pour pointer vers BoxV2
    //   3. Les données stockées dans le proxy restent intactes
    //   4. L'adresse du proxy ne change pas
    // Résultat : même adresse, nouvelles fonctionnalités, données préservées
    const proxyContract = await upgrades.upgradeProxy(proxyAddress, BoxV2);

    // Vérification que l'adresse du proxy n'a pas changé
    // Cette adresse doit être identique à proxyAddress
    console.log("Box upgraded to:", await proxyContract.getAddress());

    // ==================== ÉTAPE 3 : TEST DES FONCTIONNALITÉS ====================
    // Test 1 : Utilisation de la fonction store() (déjà présente dans Box v1)
    // On stocke la valeur 43
    let transaction = await proxyContract.store(43);
    await transaction.wait(); // Attendre la confirmation de la transaction

    // Test 2 : Utilisation de la NOUVELLE fonction increment() (ajoutée dans BoxV2)
    // Cette fonction incrémente la valeur stockée de 1
    // Ici : 43 + 1 = 44
    let transaction2 = await proxyContract.increment();
    await transaction2.wait(); // Attendre la confirmation de la transaction

    // Affichage de la valeur finale : devrait afficher 44
    console.log("Value stored:", await proxyContract.retrieve());

    // Vérification de la version du contrat
    // La version devrait maintenant indiquer "v2" ou similaire
    let version = await proxyContract.version();
    console.log("Box version:", version);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});