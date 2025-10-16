import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "localhost",
});

async function main(): Promise<void> {
    console.log('Déploiement en cours...');

    const Counter = await ethers.deployContract("Counter");

    console.log(`Contract déployé à ${Counter.target}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

