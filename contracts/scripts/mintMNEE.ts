import { network } from "hardhat";

const { ethers } = await network.connect();

const signers =  await ethers.getSigners();

const Token = new ethers.Contract(
  process.env.MNEE_ADDRESS!,
  [
    "function mint(address to, uint256 amount) external",
    "function balanceOf(address account) view returns (uint256)",
  ],
  signers[0]
);


for await (const signer of signers) {
  console.log(signer.address);
  await Token.mint(signer.address, ethers.parseEther(((Math.random() * 1000 - 100) + 100).toString()));
}