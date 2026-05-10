import { expect } from "chai";
import "@nomicfoundation/hardhat-ethers";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("SecureStorage", function () {
  let storage: any;
  let owner: any;
  let otherAccount: any;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    storage = await ethers.deployContract("SecureStorage");
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


// Digital Signature Tests

it("Valid signature should return true", async function () {
  const message = "Hello, Blockchain!";

  // Owner signs the keccak256 hash of the message (matches contract's verifyMessage logic)
  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
  const signature = await owner.signMessage(ethers.getBytes(messageHash));

  // Extract v, r, s from signature (v, r, s - are three parts of one and the same signature)
  const sig = ethers.Signature.from(signature);
  const v = sig.v;
  const r = sig.r;
  const s = sig.s;

  // Verify the signature
  const isValid = await storage.verifyMessage(message, v, r, s);

  // Should return true because owner signed it
  expect(isValid).to.equal(true);
});

it("Invalid signature (non-owner) should return false", async function () {
  const message = "Hello, Blockchain!";

  // Other account (not owner) signs the keccak256 hash of the message
  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
  const signature = await otherAccount.signMessage(ethers.getBytes(messageHash));

  // Extract v, r, s from signature
  const sig = ethers.Signature.from(signature);
  const v = sig.v;
  const r = sig.r;
  const s = sig.s;

  // Verify the signature
  const isValid = await storage.verifyMessage(message, v, r, s);

  // Should return false because signer is not the owner
  expect(isValid).to.equal(false);
});

it("Signature for different message should return false", async function () {
  const originalMessage = "Hello, Blockchain!";
  const differentMessage = "Different message!";

  // Owner signs the keccak256 hash of the original message
  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(originalMessage));
  const signature = await owner.signMessage(ethers.getBytes(messageHash));

  // Extract v, r, s from signature
  const sig = ethers.Signature.from(signature);
  const v = sig.v;
  const r = sig.r;
  const s = sig.s;

  // Verify with DIFFERENT message (not the one that was signed)
  const isValid = await storage.verifyMessage(differentMessage, v, r, s);

  // Should return false because message doesn't match the signature
  expect(isValid).to.equal(false);
});
});
