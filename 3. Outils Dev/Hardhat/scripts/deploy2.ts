import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "localhost",
});

async function main(): Promise<void> {
    console.log('Déploiement en cours...');

    const Voting = await ethers.deployContract("Voting", 
      ["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"], 
      {  value: 10_000_000_000_000_000n, 
    });// 0.01ETH

    console.log(`Contract déployé à ${Voting.target}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

