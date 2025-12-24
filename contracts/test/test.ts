// import { expect } from "chai";
// import { ethers, upgrades } from "hardhat";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// describe("Marketplace (UUPS)", function () {

//   async function deployFixture() {
//     const [owner, seller, buyer, feeRecipient, arbitrator, other] =
//       await ethers.getSigners();

//     // Deploy mock token
//     const Token = await ethers.getContractFactory("MockERC20");
//     const token = await Token.deploy();

//     // Mint tokens to buyer
//     await token.mint(buyer.address, ethers.parseEther("1000"));

//     // Deploy Marketplace (UUPS)
//     const Marketplace = await ethers.getContractFactory("Marketplace");
//     const marketplace = await upgrades.deployProxy(
//       Marketplace,
//       [token.target, feeRecipient.address, arbitrator.address],
//       { kind: "uups" }
//     );

//     return {
//       marketplace,
//       token,
//       owner,
//       seller,
//       buyer,
//       feeRecipient,
//       arbitrator,
//       other,
//     };
//   }

//   /*//////////////////////////////////////////////////////////////
//                             INITIALIZATION
//   //////////////////////////////////////////////////////////////*/

//   it("initializes correctly", async () => {
//     const { marketplace, feeRecipient, arbitrator } = await loadFixture(deployFixture);

//     expect(await marketplace.platformFeeBps()).to.equal(300);
//     expect(await marketplace.feeRecipient()).to.equal(feeRecipient.address);
//     expect(await marketplace.arbitrator()).to.equal(arbitrator.address);
//   });

//   /*//////////////////////////////////////////////////////////////
//                             ADMIN
//   //////////////////////////////////////////////////////////////*/

//   it("owner can update platform fee", async () => {
//     const { marketplace } = await loadFixture(deployFixture);

//     await expect(marketplace.setPlatformFee(400))
//       .to.emit(marketplace, "PlatformFeeUpdated")
//       .withArgs(400);

//     expect(await marketplace.platformFeeBps()).to.equal(400);
//   });

//   it("non-owner cannot update platform fee", async () => {
//     const { marketplace, buyer } = await loadFixture(deployFixture);

//     await expect(
//       marketplace.connect(buyer).setPlatformFee(400)
//     ).to.be.reverted;
//   });

//   /*//////////////////////////////////////////////////////////////
//                             PRODUCTS
//   //////////////////////////////////////////////////////////////*/

//   it("seller can create a product", async () => {
//     const { marketplace, seller } = await loadFixture(deployFixture);

//     await expect(
//       marketplace.connect(seller).createProduct(
//         ethers.parseEther("10"),
//         "ipfs://product"
//       )
//     )
//       .to.emit(marketplace, "ProductCreated")
//       .withArgs(1, seller.address);

//     const product = await marketplace.products(1);
//     expect(product.price).to.equal(ethers.parseEther("10"));
//     expect(product.active).to.equal(true);
//   });

//   it("only seller can update product status", async () => {
//     const { marketplace, seller, buyer } = await loadFixture(deployFixture);

//     await marketplace.connect(seller).createProduct(
//       ethers.parseEther("10"),
//       "ipfs://product"
//     );

//     await expect(
//       marketplace.connect(buyer).setProductStatus(1, false)
//     ).to.be.revertedWith("Not seller");
//   });

//   /*//////////////////////////////////////////////////////////////
//                         PURCHASE & ESCROW
//   //////////////////////////////////////////////////////////////*/

//   it("buyer can purchase product", async () => {
//     const { marketplace, seller, buyer, token } =
//       await loadFixture(deployFixture);

//     await marketplace.connect(seller).createProduct(
//       ethers.parseEther("10"),
//       "ipfs://product"
//     );

//     await token.connect(buyer).approve(
//       marketplace.target,
//       ethers.parseEther("10")
//     );

//     await expect(
//       marketplace.connect(buyer).buyProduct(1)
//     )
//       .to.emit(marketplace, "ProductPurchased")
//       .withArgs(1, 1);

//     const txn = await marketplace.transactions(1);
//     expect(txn.buyer).to.equal(buyer.address);
//     expect(txn.status).to.equal(0); // Pending
//   });

//   /*//////////////////////////////////////////////////////////////
//                         CONFIRM DELIVERY
//   //////////////////////////////////////////////////////////////*/

//   it("buyer can confirm delivery and seller gets paid", async () => {
//     const { marketplace, seller, buyer, token, feeRecipient } =
//       await loadFixture(deployFixture);

//     await marketplace.connect(seller).createProduct(
//       ethers.parseEther("10"),
//       "ipfs://product"
//     );

//     await token.connect(buyer).approve(
//       marketplace.target,
//       ethers.parseEther("10")
//     );

//     await marketplace.connect(buyer).buyProduct(1);

//     const sellerBalanceBefore = await token.balanceOf(seller.address);

//     await expect(
//       marketplace.connect(buyer).confirmDelivery(1)
//     ).to.emit(marketplace, "TransactionCompleted");

//     const sellerBalanceAfter = await token.balanceOf(seller.address);
//     const fee = ethers.parseEther("10") * 300n / 10_000n;

//     expect(sellerBalanceAfter - sellerBalanceBefore)
//       .to.equal(ethers.parseEther("10") - fee);

//     expect(await token.balanceOf(feeRecipient.address)).to.equal(fee);
//   });

//   /*//////////////////////////////////////////////////////////////
//                             REFUNDS
//   //////////////////////////////////////////////////////////////*/

//   it("seller can cancel transaction and refund buyer", async () => {
//     const { marketplace, seller, buyer, token } =
//       await loadFixture(deployFixture);

//     await marketplace.connect(seller).createProduct(
//       ethers.parseEther("10"),
//       "ipfs://product"
//     );

//     await token.connect(buyer).approve(
//       marketplace.target,
//       ethers.parseEther("10")
//     );

//     await marketplace.connect(buyer).buyProduct(1);

//     const buyerBefore = await token.balanceOf(buyer.address);

//     await expect(
//       marketplace.connect(seller).cancelTransaction(1)
//     ).to.emit(marketplace, "TransactionRefunded");

//     const buyerAfter = await token.balanceOf(buyer.address);
//     expect(buyerAfter - buyerBefore).to.equal(ethers.parseEther("10"));
//   });

//   /*//////////////////////////////////////////////////////////////
//                             DISPUTES
//   //////////////////////////////////////////////////////////////*/

//   it("buyer can open dispute and arbitrator resolves in buyer favor", async () => {
//     const { marketplace, seller, buyer, token, arbitrator } =
//       await loadFixture(deployFixture);

//     await marketplace.connect(seller).createProduct(
//       ethers.parseEther("10"),
//       "ipfs://product"
//     );

//     await token.connect(buyer).approve(
//       marketplace.target,
//       ethers.parseEther("10")
//     );

//     await marketplace.connect(buyer).buyProduct(1);
//     await marketplace.connect(buyer).openDispute(1);

//     await expect(
//       marketplace.connect(arbitrator).resolveDispute(1, true)
//     )
//       .to.emit(marketplace, "DisputeResolved")
//       .withArgs(1, true);

//     const txn = await marketplace.transactions(1);
//     expect(txn.status).to.equal(3); // Refunded
//   });

//   /*//////////////////////////////////////////////////////////////
//                             REVIEWS
//   //////////////////////////////////////////////////////////////*/

//   it("buyer can submit review after purchase", async () => {
//     const { marketplace, seller, buyer, token } =
//       await loadFixture(deployFixture);

//     await marketplace.connect(seller).createProduct(
//       ethers.parseEther("10"),
//       "ipfs://product"
//     );

//     await token.connect(buyer).approve(
//       marketplace.target,
//       ethers.parseEther("10")
//     );

//     await marketplace.connect(buyer).buyProduct(1);
//     await marketplace.connect(buyer).confirmDelivery(1);

//     await expect(
//       marketplace.connect(buyer).submitReview(1, 5, "Great product")
//     )
//       .to.emit(marketplace, "ReviewSubmitted")
//       .withArgs(1, buyer.address);

//     const avg = await marketplace.getAverageRating(1);
//     expect(avg).to.equal(500); // scaled by 100
//   });
// });
