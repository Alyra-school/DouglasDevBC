# SimpleStorage DApp

Application décentralisée (DApp) permettant de stocker et récupérer une valeur numérique sur la blockchain Ethereum en utilisant un smart contract Solidity.

## Description

SimpleStorage est une DApp complète comprenant :
- **Backend** : Smart contracts Solidity déployés avec Hardhat
- **Frontend** : Application Next.js moderne avec intégration Web3

Le contrat `SimpleStorage` permet aux utilisateurs de stocker un nombre sur la blockchain et d'émettre un événement à chaque modification, permettant ainsi de suivre l'historique des changements.

## Technologies utilisées

### Backend
- **Hardhat 3** - Framework de développement Ethereum
- **Solidity 0.8.28** - Langage pour les smart contracts
- **Ethers.js v6** - Bibliothèque d'interaction avec Ethereum
- **TypeScript** - Typage statique
- **Mocha & Chai** - Framework de tests
- **Forge-std** - Tests Solidity compatibles Foundry

### Frontend
- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **RainbowKit** - Connexion wallet intuitive
- **Wagmi v2** - Hooks React pour Ethereum
- **Viem** - Interface TypeScript-first pour Ethereum
- **TailwindCSS v4** - Framework CSS utility-first
- **TypeScript** - Typage statique

## Structure du projet

```
simplestorage/
├── backend/                 # Smart contracts et configuration Hardhat
│   ├── contracts/          # Contrats Solidity
│   │   ├── SimpleStorage.sol
│   │   └── Counter.sol
│   ├── test/               # Tests des contrats
│   ├── scripts/            # Scripts de déploiement
│   ├── ignition/           # Modules Hardhat Ignition
│   └── hardhat.config.ts   # Configuration Hardhat
│
└── frontend/               # Application Next.js
    ├── src/
    │   ├── app/           # Pages Next.js (App Router)
    │   ├── components/    # Composants React
    │   ├── providers/     # Providers (RainbowKit, Wagmi)
    │   ├── lib/          # Utilitaires
    │   └── utils/        # Fonctions helper
    └── package.json
```

## Installation

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn
- Un wallet Web3 (MetaMask recommandé)

### 1. Cloner le repository

```bash
git clone <url-du-repo>
cd simplestorage
```

### 2. Installation du Backend

```bash
cd backend
npm install
```

### 3. Installation du Frontend

```bash
cd frontend
npm install
```

## Utilisation

### Backend - Smart Contracts

#### Lancer les tests

```bash
cd backend
npx hardhat test
```

Pour tester uniquement les tests Solidity :
```bash
npx hardhat test solidity
```

Pour tester uniquement les tests Mocha :
```bash
npx hardhat test mocha
```

#### Déployer sur un réseau local

```bash
npx hardhat ignition deploy ignition/modules/SimpleStorage.ts --network localhost
```

#### Déployer sur Sepolia

1. Configurer la clé privée :
```bash
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

2. Déployer :
```bash
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```

### Frontend - Application Web

#### Mode développement

```bash
cd frontend
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

#### Build de production

```bash
npm run build
npm start
```

#### Linter

```bash
npm run lint
```

## Fonctionnalités

### Smart Contract SimpleStorage

Le contrat `SimpleStorage.sol` offre les fonctionnalités suivantes :

- **setMyNumber(uint256)** : Stocke un nombre sur la blockchain
- **getMyNumber()** : Récupère le nombre stocké
- **Event NumberChanged** : Émis à chaque modification avec l'adresse et la nouvelle valeur

```solidity
contract SimpleStorage {
    uint256 private myNumber;

    event NumberChanged(address indexed by, uint256 number);

    function setMyNumber(uint256 _myNumber) external {
        myNumber = _myNumber;
        emit NumberChanged(msg.sender, _myNumber);
    }

    function getMyNumber() external view returns (uint256) {
        return myNumber;
    }
}
```

### Interface Frontend

L'application web permet de :
- Connecter son wallet via RainbowKit
- Lire la valeur stockée dans le contrat
- Modifier la valeur stockée
- Visualiser l'historique des événements

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT

## Auteur

Ben BK

## Liens utiles

- [Documentation Hardhat](https://hardhat.org/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation RainbowKit](https://rainbowkit.com)
- [Documentation Wagmi](https://wagmi.sh)
- [Documentation Solidity](https://docs.soliditylang.org)
