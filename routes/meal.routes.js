const Meal = require("../models/Meal.model");
const User = require("../models/User.model");
const Order = require("../models/Order.model");
const Rating = require("../models/Rating.model");

const router = require("express").Router();

//get all meals
router.get("/", async (req, res) => {
  try {
    const meals = await Meal.find().populate({
      path: "user",
      populate: {
        path: "address", // Assuming 'address' is a reference in the User model
        model: "Address", // Replace with the actual model name if needed
      },
    });
    res.status(200).json(meals);
  } catch (error) {
    console.log("Error getting all meals:", error);
    res.status(500).json({ message: "Error getting all meals." });
  }
});

//get all active meals
router.get("/active", async (req, res) => {
  try {
    const meals = await Meal.find().populate({
      path: "user",
      populate: {
        path: "address", // Assuming 'address' is a reference in the User model
        model: "Address", // Replace with the actual model name if needed
      },
    });

    const currentTime = new Date();
    //Filter all Active Meals on pickup time & plates available
    const activeMeals = meals.filter((meal) => {
      const pickupTime = new Date(meal.pickupTime); // Convert pickupTime to a Date object
      return pickupTime >= currentTime && meal.plates > 0;
    });

    res.status(200).json(activeMeals);
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
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userMeals = await Meal.find({ user: userId }).lean();
    if (userMeals.length === 0) {
      return res.status(200).json(userMeals);
    }

    // Extract meal IDs to add more details for them
    const userMealIds = userMeals.map((meal) => meal._id);

    //Add Meal Booking Info=>
    // Fetch all meals by the chef
    const mealOrders = await Order.find({
      meal: { $in: userMealIds },
      status: "IN_PROGRESS",
    });

    userMeals.forEach((meal) => {
      const orders = mealOrders.filter((order) => {
        return order.meal.toString() === meal._id.toString();
      });

      if (orders.length > 0) {
        meal.booked = orders.length;
      } else {
        meal.booked = 0;
      }
    });

    //Add Meal Rating Info=>
    //Fetch all the meal ratings of the user meals
    const mealRatings = await Rating.find({
      meal: { $in: userMealIds },
    });

    //Avg the rating for every meal
    const userMealsDetails = userMeals.map((meal) => {
      const ratings = mealRatings.filter((rating) => {
        return rating.meal.toString() === meal._id.toString();
      });

      if (ratings.length > 0) {
        const totalRating = ratings.reduce((a, c) => a + c.stars, 0);
        return {
          ...meal,
          mealRating: totalRating / ratings.length,
        };
      } else {
        return { ...meal, mealRating: 0 };
      }
    });

    res.status(200).json(userMealsDetails);
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
    const mealUpdated = await Meal.findByIdAndUpdate(mealId, req.body, {
      new: true,
    });
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
    const deletedMeal = await Meal.findByIdAndDelete(mealId);
    res.status(200).json(deletedMeal);
  } catch (error) {
    console.log("Error deleting the meal:", error);
    res.status(500).json({ message: "Error deleting the meal." });
  }
});

module.exports = router;
