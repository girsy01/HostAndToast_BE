const Order = require("../models/Order.model");
const Meal = require("../models/Meal.model");
const Message = require("../models/Message.model");
const { default: mongoose } = require("mongoose");

const router = require("express").Router();

//get all Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user") // Populate user details
      .populate("meal"); // Populate meal details
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error getting all orders:", error);
    res.status(500).json({ message: "Error getting all orders." });
  }
});

//get one order by id
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId)
      .populate("user") // Populate user details
      .populate("meal"); // Populate meal details
    res.status(200).json(order);
  } catch (error) {
    console.log("Error getting the order:", error);
    res.status(500).json({ message: "Error getting the order." });
  }
});

//get all orders for one specific user
// router.get("/user/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const userOrders = await Order.find({ user: userId })
//       .populate("user")
//       .populate("meal");
//     res.status(200).json(userOrders);
//   } catch (error) {
//     console.log("Error getting the orders:", error);
//     res.status(500).json({ message: "Error getting the orders." });
//   }
// });const mongoose = require("mongoose");

//get all orders for one specific user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  // console.log("Checking userId:", userId); // Debugging log

  // Validate userId before querying MongoDB
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const userOrders = await Order.find({ user: userId })
      .populate("user") // Populate user details
      .populate({
        path: "meal",
        populate: {
          path: "user", // Populate the user who created the meal
          populate: { path: "address" }, // Populate the address of user who created the meal
        },
      })
      .populate("rating"); // Populate order rating

    // console.log("Orders found:", userOrders);
    res.status(200).json(userOrders);
  } catch (error) {
    console.log("Error getting the orders:", error);
    res.status(500).json({ message: "Error getting the orders." });
  }
});

//get all statistics for chef
router.get("/chef-stats/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch all meals by the chef
    const chefMeals = await Meal.find({ user: userId });
    // Extract meal IDs to fetch related orders
    const chefMealIds = chefMeals.map((meal) => meal._id);

    //Fetch all the completed orders of the Chef
    const chefOrders = await Order.find({
      status: "FINISHED",
      meal: { $in: chefMealIds },
    });

    const platesServed = chefOrders.length;
    const totalRevenue = chefOrders.reduce((a, c) => {
      return a + c.price;
    }, 0);

    res
      .status(200)
      .json({ platesServed: platesServed, totalRevenue: totalRevenue });
  } catch (error) {
    console.log("Error getting the orders:", error);
    res.status(500).json({ message: "Error getting the orders." });
  }
});

//get all PAID customers for one specific meal
router.get("/customer/:mealId", async (req, res) => {
  const { mealId } = req.params;

  try {
    const userOrders = await Order.find({
      meal: mealId,
      status: "PAID",
    }).populate("user");

    res.status(200).json(userOrders);
  } catch (error) {
    console.log("Error getting the meal order details:", error);
    res.status(500).json({ message: "Error getting the meal order details." });
  }
});

//create a new order
router.post("", async (req, res) => {
  try {
    let meal = await Meal.findById(req.body.meal).populate("user");

    //1. Create communication between the Customer & the Chef if not already

    //1.01. CHECK if any old communication exists
    const messages = await Message.find({
      $or: [
        {
          senderId: req.body.user, //Customer sent a message to Chef
          receiverId: meal.user._id, //Chef
        },
        {
          senderId: meal.user._id, //Chef sent a message to Customer
          receiverId: req.body.user, //Customer
        },
      ],
    });

    if (!messages || messages.length === 0) {
      //1.02. No old communication exists. Create 1st communication
      message = await Message.create({
        senderId: req.body.user,
        receiverId: meal.user._id,
        text: "",
      });

      console.log("New communivation created message", message);
    }

    //2. We update the Meal to reduce the no of plates
    const leftOverPlates = meal.plates - req.body.plates;
    meal.plates = leftOverPlates > 0 ? leftOverPlates : 0;
    const mealUpdated = await Meal.findByIdAndUpdate(req.body.meal, meal, {
      new: true,
    });
    console.log("Meal updated for order creation", mealUpdated);

    req.body.status = "RESERVED"; //New Order status

    //3. Create the order for the Customer
    const order = await Order.create(req.body);

    res.status(201).json(order);
  } catch (error) {
    console.log("Error creating the order:", error);
    res.status(500).json({ message: "Error creating the order." });
  }
});

//update a order by id
router.put("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    const orderUpdated = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true,
    });
    res.status(201).json(orderUpdated);
  } catch (error) {
    console.log("Error updating the order:", error);
    res.status(500).json({ message: "Error updating the order." });
  }
});

//delete an order by id
router.delete("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    //Fetch the meal from order
    const order = await Order.findById(orderId).populate("meal"); // Populate meal details

    //Increment the available plates for the meal
    order.meal.plates = order.meal.plates + order.plates;
    console.log("Meal for order deletion ", order.meal._id, order.meal.plates);
    const mealUpdated = await Meal.findByIdAndUpdate(
      order.meal._id,
      { plates: order.meal.plates },
      {
        new: true,
      }
    );

    //Delete the order
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    res.status(200).json(deletedOrder);
  } catch (error) {
    console.log("Error deleting the order:", error);
    res.status(500).json({ message: "Error deleting the order." });
  }
});

module.exports = router;
