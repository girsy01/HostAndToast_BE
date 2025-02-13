const Message = require("../models/Message.model");
const User = require("../models/User.model");

const router = require("express").Router();

//get all messages for a user by id
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    //CHECK
    const messages = await Message.find({
      $or: { senderId: userId, recieverId: userId },
    })
      .populate("senderId")
      .populate("receiverId");

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error getting the messages:", error);
    res.status(500).json({ message: "Error getting the messages." });
  }
});

//create a new message between the users
router.post("/send", async (req, res) => {
  try {
    const message = await Message.create(req.body);

    res.status(201).json(message);
  } catch (error) {
    console.log("Error creating the message:", error);
    res.status(500).json({ message: "Error creating the message." });
  }
});

module.exports = router;
