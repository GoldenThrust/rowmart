import mongoose from "mongoose";
import { Contract } from "ethers";
import { JsonRpcProvider } from "ethers";
import { MarketplaceContractConfig } from "./contract/marketPlace.js";
import Product from "./models/product.js";
import Transaction from "./models/transaction.js";


mongoose.connect("mongodb://0.0.0.0:27017/rowmart", {
    autoIndex: false,
    maxPoolSize: 10,
}).then(async () => {
    const provider = new JsonRpcProvider();

    const contract = new Contract(
        ...MarketplaceContractConfig,
        provider
    );

    const transactions = await Transaction.find({});

    transactions.forEach(async (transaction) => {
        try {
            const onChainTransaction = await contract.transactions(transaction.transactionId);
            // console.log(`Updated transaction ${transaction.transactionId} with status ${onChainTransaction.status}`);
            console.log(onChainTransaction);
        } catch (err) {
            console.error(`Failed to update transaction ${transaction.transactionId}:`, err);
        }
    });
    // const products = await Product.find({});

    // products.forEach(async (product) => {
    //     try {
    //         const onChainProduct = await contract.products(product.productId);
    //         const sellerAddress = onChainProduct.seller;
    //         product.seller = sellerAddress;
    //         await product.save();
    //         console.log(`Updated product ${product.productId} with seller ${sellerAddress}`);
    //     } catch (err) {
    //         console.error(`Failed to update product ${product.productId}:`, err);
    //     }
    // });
}).catch((err) => {
    process.exit(1);
});