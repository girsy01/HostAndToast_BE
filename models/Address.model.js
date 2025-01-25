const { Schema, model } = require("mongoose");

const addressSchema = new Schema(
  {
    street: {
      type: String,
      required: [true, "Street is required."],
    },
    houseNumber: {
      type: String,
      required: [true, "House number is required."],
    },
    plz: {
      type: Number,
      required: [true, "PLZ is required."],
    },
    city: {
      type: String,
      required: [true, "City is required."],
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
