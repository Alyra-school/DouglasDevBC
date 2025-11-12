# Déploiement, todo

Lorsque l'on déploie il faut penser à plusieurs choses :

- **Backend** : Ajouter Sepolia et le verify au niveau de hardhat.config.ts
- **Backend** : Vérifier qu'on a bien mis la clé privée, l'url de RPC et l'api key de etherscan dans le store hardhat 
- **Backend** : Déployer le contrat sur la Blockchain en question
- **Frontend** : Mettre à jour le fichier constants.ts
- **Frontend** : Mettre à jour le network sans RainbowKit
- **Frontend** : Si on utilise un client.ts, mettre à jour ce fichier avec le bon réseau et la bonne url de rpc
- **Frontend** : Penser à vérifier que .env.local est bien dans le .gitignore
- **Frontend** : Si vous récupérez des évènements, bien checker que c'est à partir du bloc dans lequel le contrat intelligent a été déployé
- **Frontend** : Tester en local