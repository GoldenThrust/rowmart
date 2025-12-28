import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

const [owner, seller, buyer, feeRecipient, arbitrator, other] =
  await ethers.getSigners();
const signers = [owner, seller, buyer, feeRecipient, arbitrator, other];
const Token = await ethers.getContractAt(
  "MockERC20",
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  owner
);

for await (const signer of signers) {
  console.log(signer.address);
  // const balance = await Token.balanceOf(signer.address);
  await Token.mint(signer.address, ethers.parseEther("1000"));
  //   console.log(ethers.formatUnits(balance, 18));
}

// signers.forEach(async (signer) => {
// });
// Mint Tokens to buyer
// await Token.mint(seller.address, ethers.parseEther("1000"));
