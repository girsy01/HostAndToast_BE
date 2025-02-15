const Rating = require("../models/Rating.model");
const Order = require("../models/Order.model");

const router = require("express").Router();

//get all ratings
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.status(200).json(ratings);
  } catch (error) {
    console.log("Error getting all ratings:", error);
    res.status(500).json({ message: "Error getting all ratings." });
  }
});

//get one rating by id
router.get("/:ratingId", async (req, res) => {
  const { ratingId } = req.params;
  try {
    const rating = await Rating.findById(ratingId);
    res.status(200).json(rating);
  } catch (error) {
    console.log("Error getting the rating:", error);
    res.status(500).json({ message: "Error getting the rating." });
  }
});

//get all ratings for one specific meal
router.get("/meals/:mealId", async (req, res) => {
  const { mealId } = req.params;
  try {
    const ratings = await Rating.find().populate("user").populate("meal");
    const ratingsMeal = ratings.filter((rating) => {
      return rating.meal._id.toString() === mealId;
    });
    res.status(200).json(ratingsMeal);
  } catch (error) {
    console.log("Error getting the ratings:", error);
    res.status(500).json({ message: "Error getting the ratings." });
  }
});

//create a new rating
router.post("", async (req, res) => {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json(rating);
  } catch (error) {
    console.log("Error creating the rating:", error);
    res.status(500).json({ message: "Error creating the rating." });
  }
});

//create a new rating for Order
router.post("/order/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    const rating = await Rating.create(req.body);

    //Update the order with the rating id
    await Order.findByIdAndUpdate(orderId, { rating: rating._id });

    res.status(201).json(rating);
  } catch (error) {
    console.log("Error creating the rating:", error);
    res.status(500).json({ message: "Error creating the rating." });
  }
});

//update a rating by id
router.put("/:ratingId", async (req, res) => {
  const { ratingId } = req.params;
  try {
    const ratingUpdated = await Rating.findByIdAndUpdate(ratingId, req.body, {
      new: true,
    });
    res.status(201).json(ratingUpdated);
  } catch (error) {
    console.log("Error updating the rating:", error);
    res.status(500).json({ message: "Error updating the rating." });
  }
});

//delete a meal by id
router.delete("/:ratingId", async (req, res) => {
  const { ratingId } = req.params;
  try {
    const deletedRating = await Rating.findByIdAndDelete(ratingId);
    res.status(200).json(deletedRating);
  } catch (error) {
    console.log("Error deleting the rating:", error);
    res.status(500).json({ message: "Error deleting the rating." });
  }
});

module.exports = router;
