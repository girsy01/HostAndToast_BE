const { Schema, model } = require("mongoose");

const ratingSchema = new Schema(
  {
    stars: {
      type: Number,
      required: [true, "Stars is required."],
    },
    comment: String,
    meal: {
      type: Schema.Types.ObjectId,
      ref: "Meal",
      required: [true, "Meal is required."],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
