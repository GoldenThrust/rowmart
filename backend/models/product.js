import { model, Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
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
    productId: Number,
})

const Product = model("Product", productSchema);
export default Product;