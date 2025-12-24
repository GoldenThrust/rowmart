import { expect } from "chai";

import hre from "hardhat";

const { ethers, networkHelpers } = await hre.network.connect();
const { loadFixture } = networkHelpers;

describe("Marketplace (UUPS)", function () {
  async function deployFixture() {
    const [owner, seller, buyer, feeRecipient, arbitrator, other] =
      await ethers.getSigners();

    // Deploy mock token
    const Token = await ethers.deployContract("MockERC20");
    const tokenAddress = await Token.getAddress();
    networkHelpers.setBalance(tokenAddress, 1000000n);

    // Mint tokens to buyer
    await Token.mint(buyer.address, ethers.parseEther("1000"));

    // Deploy Marketplace (UUPS)
    const marketplace = await ethers.deployContract("Marketplace");
    await marketplace.initialize(
      tokenAddress,
      feeRecipient.address,
      arbitrator.address
    );

    return {
      marketplace,
      Token,
      owner,
      seller,
      buyer,
      feeRecipient,
      arbitrator,
      other,
    };
  }

  /*//////////////////////////////////////////////////////////////
                              INITIALIZATION
    //////////////////////////////////////////////////////////////*/

  it("initializes correctly", async () => {
    const { marketplace, feeRecipient, arbitrator } = await loadFixture(
      deployFixture
    );

    expect(await marketplace.platformFeeBps()).to.equal(300);
    expect(await marketplace.feeRecipient()).to.equal(feeRecipient.address);
    expect(await marketplace.arbitrator()).to.equal(arbitrator.address);
  });

  /*//////////////////////////////////////////////////////////////
                            ADMIN
  //////////////////////////////////////////////////////////////*/

  it("owner can update platform fee", async () => {
    const { marketplace } = await loadFixture(deployFixture);

    await expect(marketplace.setPlatformFee(400))
      .to.emit(marketplace, "PlatformFeeUpdated")
      .withArgs(400);

    expect(await marketplace.platformFeeBps()).to.equal(400);
  });

  it("Fee must be between 2% and 5%", async () => {
    const { marketplace } = await loadFixture(deployFixture);

    await expect(marketplace.setPlatformFee(100)).to.be.revertedWith(
      "Fee must be between 2% and 5%"
    );

    await expect(marketplace.setPlatformFee(600)).to.be.revertedWith(
      "Fee must be between 2% and 5%"
    );
  });

  it("non-owner cannot update platform fee", async () => {
    const { marketplace, buyer } = await loadFixture(deployFixture);

    await expect(marketplace.connect(buyer).setPlatformFee(400)).to.be.revert(
      ethers
    );
  });

  it("owner can change arbitrator", async () => {
    const { marketplace, other } = await loadFixture(deployFixture);

    await expect(marketplace.setArbitrator(other.address))
      .to.emit(marketplace, "ArbitratorUpdated")
      .withArgs(other.address);

    expect(await marketplace.arbitrator()).to.equal(other.address);
  });

  it("non-owner cannot change arbitrator", async () => {
    const { marketplace, buyer, other } = await loadFixture(deployFixture);

    await expect(
      marketplace.connect(buyer).setArbitrator(other.address)
    ).to.be.revert(ethers);
  });

  /*//////////////////////////////////////////////////////////////
                            PRODUCTS
  //////////////////////////////////////////////////////////////*/

  it("seller can create a product", async () => {
    const { marketplace, seller } = await loadFixture(deployFixture);

    await expect(
      marketplace.connect(seller).createProduct(
        ethers.parseEther("10"),
        "ipfs://product"
      )
    )
    .to.emit(marketplace, "ProductCreated")
      .withArgs(1, seller.address);

    const product = await marketplace.products(1);
    expect(product.price).to.equal(ethers.parseEther("10"));
    expect(product.active).to.equal(true);
  });

  it("price and uri bytes must be greater than zero", async () => {
    const { marketplace, seller } = await loadFixture(deployFixture);
    await expect(
      marketplace.connect(seller).createProduct(
        0,
        "ipfs://product"
      )
    ).to.be.revertedWith("Price and URI bytes must be greater than zero");

    await expect(
      marketplace.connect(seller).createProduct(
        ethers.parseEther("10"),
        ""
      )
    ).to.be.revertedWith("Price and URI bytes must be greater than zero");
  });

  it("seller can update product price", async () => {
    const { marketplace, seller } = await loadFixture(deployFixture);

    await marketplace.connect(seller).createProduct(
      ethers.parseEther("10"),
      "ipfs://product"
    );

    await expect(
      marketplace.connect(seller).setProductPrice(1, ethers.parseEther("15"))
    )
      .to.emit(marketplace, "ProductPriceUpdated")
      .withArgs(1, ethers.parseEther("15"));

    const product = await marketplace.products(1);
    expect(product.price).to.equal(ethers.parseEther("15"));
  });

  it("seller cannot update product price to zero", async () => {
    const { marketplace, seller } = await loadFixture(deployFixture);

    await marketplace.connect(seller).createProduct(
      ethers.parseEther("10"),
      "ipfs://product"
    );

    await expect(
      marketplace.connect(seller).setProductPrice(1, 0)
    ).to.be.revertedWith("Price must be greater than zero");
  });

  it("non-seller cannot update product price", async () => {
    const { marketplace, seller, buyer } = await loadFixture(deployFixture);

    await marketplace.connect(seller).createProduct(
      ethers.parseEther("10"),
      "ipfs://product"
    );

    await expect(
      marketplace.connect(buyer).setProductPrice(1, ethers.parseEther("15"))
    ).to.be.revertedWith("Not seller");
  });

  it("seller can update product status", async () => {
    const { marketplace, seller } = await loadFixture(deployFixture);

    await marketplace.connect(seller).createProduct(
      ethers.parseEther("10"),
      "ipfs://product"
    );

    await expect(
      marketplace.connect(seller).setProductStatus(1, false)
    )
      .to.emit(marketplace, "ProductStatusUpdated")
      .withArgs(1, false);

    const product = await marketplace.products(1);
    expect(product.active).to.equal(false);
  });

  it("only seller can update product status", async () => {
    const { marketplace, seller, buyer } = await loadFixture(deployFixture);

    await marketplace.connect(seller).createProduct(
      ethers.parseEther("10"),
      "ipfs://product"
    );

    await expect(
      marketplace.connect(buyer).setProductStatus(1, false)
    ).to.be.revertedWith("Not seller");
  });
});
