
import { network } from "hardhat";

const { ethers } = await network.connect({
    network: "localhost",
});

async function main(): Promise<void> {
    const [num1,num2,num3] = await ethers.getSigners();
    console.log('Connection en cours...');
    const Voting = await ethers.getContractAt("Voting","0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" );
    const tx1 = await Voting.addVoter(num2.address);
    await tx1.wait();
    const tx2 = await Voting.startProposalsRegistering();
    await tx2.wait();

    const tx3 = await Voting.addProposal("Proposal 1");
    await tx3.wait();
    const tx4 = await Voting.connect(num2).addProposal("Proposal 1");
    await tx4.wait();


    console.log(`fin du script`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

