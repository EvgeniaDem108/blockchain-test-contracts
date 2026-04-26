import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StorageSimpleModule = buildModule("StorageSimpleModule", (m) => {
  const storage = m.contract("StorageSimple");
  return { storage };
});

export default StorageSimpleModule;