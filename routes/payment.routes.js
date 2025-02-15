const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body; // items = [{ id, name, price, quantity }]
    // console.log("in the create checkout session", items);

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100, // Convert to cents
      },
      quantity: item.quantity,
    }));

    // console.log("line_items", line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: ` ${FRONTEND_URL}/success`,
      cancel_url: ` ${FRONTEND_URL}/cancel`,
    });

    // console.log("session", session);

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
