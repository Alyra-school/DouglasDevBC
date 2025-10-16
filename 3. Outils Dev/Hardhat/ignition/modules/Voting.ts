import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VotingModule", (m) => {
const voting = m.contract("Voting", ["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"], {
    value: 10_000_000_000_000_000n, // 0.01ETH
  });
  return { voting };
});
