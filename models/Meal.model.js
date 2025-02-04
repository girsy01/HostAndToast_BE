const { Schema, model } = require("mongoose");

const mealSchema = new Schema(
  {
    cuisine: {
      type: String,
      required: [true, "Cuisine is required."],
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    allergies: [String],
    plates: {
      type: Number,
      required: [true, "Plates is required."],
    },
    hosted: Boolean,
    completeMeal: Boolean,
    pickupTime: {
      type: Date,
      required: [true, "Pickup time is required."],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    imageUrl: [
      {
        type: String,
        //TODO: change default image if we want to
        default:
          "https://cdn.midjourney.com/1671c6ab-9fde-4fd0-a475-344758cc84d2/0_1.png",
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Meal = model("Meal", mealSchema);

module.exports = Meal;
