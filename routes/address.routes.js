const Address = require("../models/Address.model");
const User = require("../models/User.model");

const router = require("express").Router();

//get all addresses
router.get("/", async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    console.log("Error getting all addresses:", error);
    res.status(500).json({ message: "Error getting all addresses." });
  }
});

//get one address by id
router.get("/:addId", async (req, res) => {
  const { addId } = req.params;
  try {
    const address = await Address.findById(addId);
    res.status(200).json(address);
  } catch (error) {
    console.log("Error getting the address:", error);
    res.status(500).json({ message: "Error getting the address." });
  }
});

//create a new address and link it to the user
router.post("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const address = await Address.create(req.body);

    const userUpdated = await User.findByIdAndUpdate(userId, { address: address }, { new: true });

    res.status(201).json(address);
  } catch (error) {
    console.log("Error creating the address:", error);
    res.status(500).json({ message: "Error creating the address." });
  }
});

//update a address by id
router.put("/:addressId", async (req, res) => {
  const { addressId } = req.params;
  try {
    const addressUpdated = await Address.findByIdAndUpdate(addressId, req.body, { new: true });
    res.status(201).json(addressUpdated);
  } catch (error) {
    console.log("Error updating the address:", error);
    res.status(500).json({ message: "Error updating the address." });
  }
});

//delete a address by id
router.delete("/:addressId", async (req, res) => {
  const { addressId } = req.params;
  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    res.status(200).json(deletedAddress);
  } catch (error) {
    console.log("Error deleting the address:", error);
    res.status(500).json({ message: "Error deleting the address." });
  }
});

module.exports = router;
