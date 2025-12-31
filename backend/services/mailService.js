import { TemplateEngine } from "./template-engine.js";

export default class MailService {
    constructor(mailer, appName = "Rowmart") {
        this.mailer = mailer;
        this.appName = appName;
    }

    /* -----------------------------
       PRODUCT CREATION (SELLER)
    ------------------------------ */
    async sendProductCreationMail(to,
        sellerName,
        product) {
        const html = await TemplateEngine.render("product-created", {
            PLATFORM_NAME: this.appName,
            SELLER_NAME: sellerName,
            PRODUCT_NAME: product.name,
            PRODUCT_ID: product.productId,
            PRODUCT_PRICE: product.price,
            PRODUCT_QUANTITY: product.quantity,
            CURRENCY: "MNEE",
            CREATED_DATE: new Date(product.createdAt).toLocaleString(),
        });

        await this.mailer.sendMail({
            to,
            subject: "Your product has been listed",
            html,
        });
    }

    /* -----------------------------
       PRODUCT PURCHASE (BUYER)
    ------------------------------ */
    async sendBuyerPurchaseMail(
        to,
        sellerEmail,
        product,
        quantity,
        totalPrice) {
        const html = await TemplateEngine.render("purchase-buyer", {
            PLATFORM_NAME: this.appName,
            PRODUCT_NAME: product.name,
            PURCHASE_QUANTITY: quantity,
            TOTAL_PRICE: totalPrice,
            CURRENCY: "MNEE",
            SELLER_EMAIL: sellerEmail,
            PURCHASE_DATE: new Date().toLocaleString(),
        });

        await this.mailer.sendMail({
            to,
            subject: "Purchase confirmation",
            html,
        });
    }

    /* -----------------------------
       PRODUCT PURCHASE (SELLER)
    ------------------------------ */
    async sendSellerPurchaseMail(
        to,
        buyerEmail,
        product,
        quantity,
        totalPrice,) {
        const html = await TemplateEngine.render("purchase-seller", {
            PLATFORM_NAME: this.appName,
            PRODUCT_NAME: product.name,
            PURCHASE_QUANTITY: quantity,
            TOTAL_PRICE: totalPrice,
            CURRENCY: "MNEE",
            BUYER_EMAIL: buyerEmail,
            PURCHASE_DATE: new Date().toLocaleString(),
        });

        await this.mailer.sendMail({
            to,
            subject: "Your product has been purchased",
            html,
        });
    }
}
