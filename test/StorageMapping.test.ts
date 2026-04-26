import { expect } from "chai";
import "@nomicfoundation/hardhat-ethers";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("StorageMapping", function () {
  let storageMapping: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];

    storageMapping = await ethers.deployContract("StorageMapping", [], owner);
  });

  it("Should store and retrieve value for a specific address", async function () {
    await storageMapping.set(user1.address, 100);
    expect(await storageMapping.get(user1.address)).to.equal(100);
  });

  it("Should store different values for different addresses", async function () {
    await storageMapping.set(user1.address, 100);
    await storageMapping.set(user2.address, 200);

    expect(await storageMapping.get(user1.address)).to.equal(100);
    expect(await storageMapping.get(user2.address)).to.equal(200);
  });

  it("Should return 0 for unset addresses", async function () {
    expect(await storageMapping.get(user1.address)).to.equal(0);
  });

  it("Should delete value for a specific address", async function () {
    await storageMapping.set(user1.address, 100);
    expect(await storageMapping.get(user1.address)).to.equal(100);

    await storageMapping.deleteValue(user1.address);
    expect(await storageMapping.get(user1.address)).to.equal(0);
  });
});