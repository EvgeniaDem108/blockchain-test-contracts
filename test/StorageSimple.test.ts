import "@nomicfoundation/hardhat-ethers";
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("StorageSimple", function () {
  it("Should store and retrieve a value", async function () {
    const storage = await ethers.deployContract("StorageSimple");

    await storage.setValue(42);
    const result = await storage.getValue();
    expect(result).to.equal(42);
  });
});
