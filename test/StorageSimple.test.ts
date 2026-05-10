import { expect } from "chai";
import "@nomicfoundation/hardhat-ethers";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("StorageSimple", function () {
  let storage: any;
  let owner: any;
  let otherAccount: any;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    storage = await ethers.deployContract("StorageSimple");
  });

  it("Should store and retrieve a value", async function () {
    await storage.setValue(42);
    const result = await storage.getValue();
    expect(result).to.equal(42);
  });

  it("Value can be changed by the owner only", async function () {
    await storage.setValue(100);
    const result = await storage.getValue();
    expect(result).to.equal(100);
  });

  it("Any attempt to set value by non-owner results in an error", async function () {
    await expect(
      storage.connect(otherAccount).setValue(42)
    ).to.be.revertedWith("You are not the owner! You cannot call this function");
  });

  it("Hash is successfully saved", async function () {
    const testHash = ethers.keccak256(ethers.toUtf8Bytes("Hello, Blockchain!"));
    await storage.setHashedValue(testHash);
    const savedHash = await storage.getHashedValue();
    expect(savedHash).to.equal(testHash);
  });

  it("Non-owner cannot save hash", async function () {
    const testHash = ethers.keccak256(ethers.toUtf8Bytes("Hello, Blockchain!"));
    await expect(
      storage.connect(otherAccount).setHashedValue(testHash)
    ).to.be.revertedWith("You are not the owner! You cannot call this function");
  });
});
