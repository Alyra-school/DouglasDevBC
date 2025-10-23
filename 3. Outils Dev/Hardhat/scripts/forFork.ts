import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "localhost",
});

async function main(): Promise<void> {
    const [sender] = await ethers.getSigners();
    const impersonatedSigner = await ethers.getImpersonatedSigner("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
    const balance1 = await ethers.provider.getBalance(impersonatedSigner.address);
    console.log(`Le solde de  vitalik est de : ${balance1} wei`);
    const balance2 = await ethers.provider.getBalance(sender.address);
    console.log(`Mon ancien solde (amon address  ${sender.address} ) est de : ${balance2} wei`);
    
    const tx = await impersonatedSigner.sendTransaction({
        to: sender.address,
        value: 1n * 10n ** 17n,
    });


    await tx.wait();
    console.log(`Transfert effectué, 1 wei envoyé à ${sender.address}`);
    const balance3 = await ethers.provider.getBalance(sender.address);
    console.log(`Mon nouveau solde est de : ${balance3} wei`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

