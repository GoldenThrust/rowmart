// import mongoose from "mongoose";
// import { Contract } from "ethers";
// import { JsonRpcProvider } from "ethers";
// import { MarketplaceContractConfig } from "./contract/marketPlace.js";
// import Product from "./models/product.js";
// import Transaction from "./models/transaction.js";
// import "dotenv/config"

// mongoose.connect(process.env.MONGO_URI, {
//     autoIndex: false,
//     maxPoolSize: 10,
// }).then(async () => {
//     // const provider = new JsonRpcProvider();

//     // const contract = new Contract(
//     //     ...MarketplaceContractConfig,
//     //     provider
//     // );

//     // const transactions = await Transaction.find({});

//     // transactions.forEach(async (transaction) => {
//     //     try {
//             // const onChainTransaction = await contract.transactions(transaction.transactionId);
//             // console.log(`Updated transaction ${transaction.transactionId} with status ${onChainTransaction.status}`);
//     //         console.log(onChainTransaction);
//     //     } catch (err) {
//     //         console.error(`Failed to update transaction ${transaction.transactionId}:`, err);
//     //     }
//     // });
//     const products = await Product.find({});

//     products.forEach(async (product) => {
//         console.log(product);
//     //     try {
//     //         const onChainProduct = await contract.products(product.productId);
//     //         const sellerAddress = onChainProduct.seller;
//     //         product.seller = sellerAddress;
//     //         await product.save();
//     //         console.log(`Updated product ${product.productId} with seller ${sellerAddress}`);
//     //     } catch (err) {
//     //         console.error(`Failed to update product ${product.productId}:`, err);
//     //     }
//     });
//     process.exit(0);
// }).catch((err) => {
//     process.exit(1);
// });


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your email
    pass: process.env.GMAIL_APP_PASSWORD, // app password
  },
});

await transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: "recipient@example.com",
  subject: "Test Email",
  text: "Email sent successfully",
});
