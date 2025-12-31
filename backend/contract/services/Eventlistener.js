import Product from "../../models/product.js";
import Transaction from "../../models/transaction.js";

export function listenToEvents(fastify) {
    const { contract } = fastify.ethers;
    const { mailservice } = fastify;

    contract.on(
        "ProductCreated",
        async (productId, seller, uri) => {
            console.log("ProductCreated event detected:", { productId, seller, uri });
            try {
                const product = await Product.findOneAndUpdate({ seller, imageCid: uri }, { productId: productId.toString() }, { new: true });
                await mailservice.sendProductCreationMail(product.email, seller, product);
            } catch (error) {
                fastify.log.error("Error handling ProductCreated event:", error);
                console.error("Error handling ProductCreated event:", error);
            }

        }
    );
    contract.on(
        "ProductPurchased",
        async (productId, txnId, uri) => {
            console.log("ProductPurchased event detected:", { productId, txnId, uri });
            try {
                const product = await Product.findOne({ productId });

                const transaction = await Transaction.findOneAndUpdate({ product, detailsCid: uri }, {
                    transactionId: txnId.toString(),
                }, { new: true });


                await mailservice.sendBuyerPurchaseMail(transaction.buyerEmail, product.email, product, transaction.quantity, transaction.price * transaction.quantity);
                await mailservice.sendSellerPurchaseMail(product.email, transaction.buyerEmail, product, transaction.quantity, transaction.price * transaction.quantity);
            } catch (error) {
                fastify.log.error("Error handling ProductPurchased event:", error);
                console.error("Error handling ProductPurchased event:", error);
            }
        }
    );
}