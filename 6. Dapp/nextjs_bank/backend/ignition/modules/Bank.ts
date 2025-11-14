import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BankModule", (m) => {
  const Bank = m.contract("Bank");

  return { Bank };
});
