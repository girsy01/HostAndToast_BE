const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/jwt.middleware");

const router = require("express").Router();
const saltRounds = 12;

//signing up a new user
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email, password and username." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
  }

  //commented out for making simple passwords possible during development
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({
  //     message:
  //       "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
  //   });
  //   return;
  // }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User created", user: { username, email } });
  } catch (error) {
    console.log("Error when creating user:", error);
    res.status(500).json({ message: "Error creating user." });
  }
});

//logging in an existing user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(403).json({ message: "Invalid credentials." });
    }
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (passwordCorrect) {
      const authToken = jwt.sign(
        { _id: foundUser._id, username: foundUser.username },
        process.env.TOKEN_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "8h",
        }
      );
      console.log("authToken:", authToken);
      res.status(200).json({ message: "Successful login.", authToken });
    } else {
      res.status(403).json({ message: "Unable to authenticate the user." });
    }
  } catch (error) {
    console.log("Error logging in the user:", error);
    res.status(500).json({ message: "Error logging in the user." });
  }
});

//route to verify the token
router.get("/verify", isAuthenticated, (req, res) => {
  console.log("req.payload", req.payload);
  res.status(200).json(req.payload);
});

//get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate();
    console.log("Found users", users);
    res.status(200).json(users);
  } catch (error) {
    console.log("Error getting all users:", error);
    res.status(500).json({ message: "Error getting all users." });
  }
});

//get one user by id
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("address");
    user.password = "********";
    res.status(200).json(user);
  } catch (error) {
    console.log("Error getting the user:", error);
    res.status(500).json({ message: "Error getting the user." });
  }
});

//update one user
router.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).json(user);
  } catch (error) {
    console.log("Error updating the user:", error);
    res.status(500).json({ message: "Error updating the user." });
  }
});

//delete one user by id
router.delete("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error deleting the user:", error);
    res.status(500).json({ message: "Error deleting the user." });
  }
});

module.exports = router;
