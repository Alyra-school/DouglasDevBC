import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export default buildModule("NFTModule", (m) => {
  const whitelisted: string[][] = [
    ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
    ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
    ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"],
  ];

  const merkleTree = StandardMerkleTree.of(whitelisted, ["address"]);
  console.log(`Racine de l'arbre de Merkle : ${merkleTree.root}`);

  // Utiliser m.getAccount() pour obtenir le deployer dans Hardhat Ignition v3
  const deployer = m.getAccount(0);

  const nft = m.contract("Alyra", [deployer, merkleTree.root]);

  return { nft };
});
