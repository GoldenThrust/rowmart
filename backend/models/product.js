import { model, Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    seller: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    },
    imageCid: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Product = model("Product", productSchema);
// TODO: price range filter

export default Product;