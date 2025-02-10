const Order = require("../models/Order.model");
const Meal = require("../models/Meal.model");

const router = require("express").Router();

//get all Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("meal");
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
      .populate("user")
      .populate("meal");
    res.status(200).json(order);
  } catch (error) {
    console.log("Error getting the order:", error);
    res.status(500).json({ message: "Error getting the order." });
  }
});

//get all orders for one specific user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userOrders = await Order.find({ user: userId });
    res.status(200).json(userOrders);
  } catch (error) {
    console.log("Error getting the orders:", error);
    res.status(500).json({ message: "Error getting the orders." });
  }
});

//create a new order
//Tested
router.post("", async (req, res) => {
  try {
    //We first update the Meal to reduce the no of plates
    let meal = await Meal.findById(req.body.meal);

    const leftOverPlates = meal.plates - req.body.plates;
    meal.plates = leftOverPlates > 0 ? leftOverPlates : 0;
    const mealUpdated = await Meal.findByIdAndUpdate(req.body.meal, meal, {
      new: true,
    });
    console.log("Meal updated for order creation", mealUpdated);

    req.body.status = "IN_PROGRESS"; //New Order status

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

//delete a order by id
//Tested
router.delete("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    //We first update the Meal to add the no of plates
    let meal = await Meal.findById(req.body.meal);

    meal.plates = meal.plates + req.body.plates;
    const mealUpdated = await Meal.findByIdAndUpdate(req.body.meal, meal, {
      new: true,
    });
    console.log("Meal updated for order deletion", mealUpdated);

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    res.status(200).json(deletedOrder);
  } catch (error) {
    console.log("Error deleting the order:", error);
    res.status(500).json({ message: "Error deleting the order." });
  }
});

module.exports = router;
