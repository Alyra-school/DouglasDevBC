import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleStorageModule", (m) => {
  const simpleStorage = m.contract("SimpleStorage");

  return { simpleStorage };
});
