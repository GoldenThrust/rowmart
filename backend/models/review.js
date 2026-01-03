import { model, Schema } from "mongoose";

const ratingSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    reviewer: {
        type: String,
        index: true,
    },
},
    {
        timestamps: true,
    });

ratingSchema.index({ reviewer: 1, product: 1 }, { unique: true });
const Review = model("Review", ratingSchema);

export default Review;