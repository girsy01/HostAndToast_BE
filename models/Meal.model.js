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
    plates: Number,
    hosted: Boolean,
    completeMeal: Boolean,
    date: Date,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    imageUrl: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Meal = model("Meal", mealSchema);

module.exports = Meal;
