const Message = require("../models/Message.model");
const User = require("../models/User.model");

const router = require("express").Router();

//get all messages for a user by id
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  // console.log("inside the get messages route");
  try {
    //CHECK
    const messages = await Message.find({
      $or: [
        { senderId: userId }, // Condition for senderId
        { receiverId: userId }, // Condition for receiverId
      ],
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

//create a Empty message between the users if doesn't exist already
router.post("/empty", async (req, res) => {
  try {
    //1. CHECK if any old communication exists between the users
    const messages = await Message.find({
      $or: [
        {
          senderId: req.body.senderId,
          receiverId: req.body.receiverId,
        },
        {
          senderId: req.body.receiverId,
          receiverId: req.body.senderId,
        },
      ],
    });

    if (!messages || messages.length === 0) {
      req.body.text = "";
      const message = await Message.create(req.body);
      res.status(201).json(message);
    } else {
      res.status(200).json({ message: "Old communication exists" });
    }
  } catch (error) {
    console.log("Error creating the message:", error);
    res.status(500).json({ message: "Error creating the message." });
  }
});

module.exports = router;
