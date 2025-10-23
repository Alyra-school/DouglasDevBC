
import { network } from "hardhat";

const { ethers } = await network.connect({
    network: "sepolia",
});

async function main(): Promise<void> {
    const age = await ethers.provider.getStorage("0x96884AD36c89DAc00a4dd63060D238C723a0ab3B", 0);;

    console.log(`mon age est de : ${age}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

