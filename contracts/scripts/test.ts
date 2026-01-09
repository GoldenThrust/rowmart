import { network } from "hardhat";

const { ethers } = await network.connect();

const signers = await ethers.getSigners();
const buyer = signers[5];
const Token = new ethers.Contract(
  process.env.MNEE_ADDRESS!,
  [
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  buyer
);

// const MarketPlace = new ethers.Contract(
//   process.env.MARKETPLACE_ADDRESS!,
//   [  ],
//   signers[0]
// );

Token.on("Approval", async (owner, spender, value) => {
  console.log(owner, spender, value);
});

console.log(signers[5]);
console.log(
  await Token.approve(process.env.MARKETPLACE_ADDRESS, ethers.parseEther("20"))
);

// Token.transfer(
//   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//   ethers.parseEther("20")
// );
console.log(await Token.allowance(buyer, process.env.MARKETPLACE_ADDRESS));
