import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

const [owner, seller, buyer, feeRecipient, arbitrator, other] =
  await ethers.getSigners();
const signers = [owner, seller, buyer, feeRecipient, arbitrator, other];
const Token = await ethers.getContractAt(
  "MockMNEE",
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  owner
);

for await (const signer of signers) {
  console.log(signer.address);
  await Token.mint(signer.address, ethers.parseEther("1000"));
}