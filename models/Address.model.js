const { Schema, model } = require("mongoose");

const addressSchema = new Schema(
  {
    displayName: {
      type: String,
      required: [true, "Display name is required."],
    },
    long: Number,
    lat: Number,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Address = model("Address", addressSchema);

module.exports = Address;
