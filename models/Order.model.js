const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    meal: {
      type: Schema.Types.ObjectId,
      ref: "Meal",
      require: true,
    },
    plates: {
      type: Number,
      required: [true, "Plates is required."],
    },
    price: {
      type: Number,
      required: [true, "Plates is required."],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    status: {
      type: String,
      enum: ["FINISHED", "PAID", "RESERVED"],
      require: true,
    },
    rating: {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);

module.exports = Order;
