import { expect } from "chai";
import "@nomicfoundation/hardhat-ethers";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("StorageArray", function () {
  let storageArray: any;

  beforeEach(async function () {
    storageArray = await ethers.deployContract("StorageArray");
  });

  it("Should add and get values correctly", async function () {
    await storageArray.add(10);
    await storageArray.add(20);
    await storageArray.add(30);

    expect(await storageArray.get(0)).to.equal(10);
    expect(await storageArray.get(1)).to.equal(20);
    expect(await storageArray.get(2)).to.equal(30);
    expect(await storageArray.length()).to.equal(3);
  });

  it("Should remove values correctly", async function () {
    await storageArray.add(10);
    await storageArray.add(20);
    await storageArray.add(30);

    await storageArray.remove(1); // удаляем 20

    expect(await storageArray.get(0)).to.equal(10);
    expect(await storageArray.get(1)).to.equal(30);
    expect(await storageArray.length()).to.equal(2);
  });

  it("Should revert when getting out of bounds", async function () {
    await expect(storageArray.get(0)).to.be.revertedWith("Index out of bounds");
  });

  it("Should revert when removing out of bounds", async function () {
    await expect(storageArray.remove(0)).to.be.revertedWith("Index out of bounds");
  });
});