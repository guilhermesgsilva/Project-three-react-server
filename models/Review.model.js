const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    reviewText: String,
    reviewUserCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {timestamps: true}
);

const Review = model("Review", reviewSchema);

module.exports = Review;