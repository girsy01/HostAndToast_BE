const Meal = require("../models/Meal.model");
const User = require("../models/User.model");

const router = require("express").Router();

//get all meals
router.get("/", async (req, res) => {
  try {
    const meals = await Meal.find();
    res.status(200).json(meals);
  } catch (error) {
    console.log("Error getting all meals:", error);
    res.status(500).json({ message: "Error getting all meals." });
  }
});

//get one meal by id
router.get("/:mealId", async (req, res) => {
  const { mealId } = req.params;
  try {
    const meal = await Meal.findById(mealId);
    res.status(200).json(meal);
  } catch (error) {
    console.log("Error getting the meal:", error);
    res.status(500).json({ message: "Error getting the meal." });
  }
});

//get all meals for one specific user
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const meals = await Meal.find();
    const userMeals = meals.filter((meal) => {
      return meal.user.toString() === userId;
    });
    res.status(200).json(userMeals);
  } catch (error) {
    console.log("Error getting the meals:", error);
    res.status(500).json({ message: "Error getting the meals." });
  }
});

//create a new meal
router.post("", async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(201).json(meal);
  } catch (error) {
    console.log("Error creating the meal:", error);
    res.status(500).json({ message: "Error creating the meal." });
  }
});

//update a meal by id
router.put("/:mealId", async (req, res) => {
  const { mealId } = req.params;
  try {
    const mealUpdated = await Meal.findByIdAndUpdate(mealId, req.body, { new: true });
    res.status(201).json(mealUpdated);
  } catch (error) {
    console.log("Error updating the meal:", error);
    res.status(500).json({ message: "Error updating the meal." });
  }
});

//delete a meal by id
router.delete("/:mealId", async (req, res) => {
  const { mealId } = req.params;
  try {
    const deletedMail = await Meal.findByIdAndDelete(mealId);
    res.status(200).json(deletedMail);
  } catch (error) {
    console.log("Error deleting the meal:", error);
    res.status(500).json({ message: "Error deleting the meal." });
  }
});

module.exports = router;
