import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("JobsModule", (m) => {
  const Jobs = m.contract("Jobs");
  return { Jobs };
});
