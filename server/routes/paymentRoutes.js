import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_123456789"
);

const packagePrices = {
  Basic: 2500,
  Professional: 4500,
  Executive: 8500,
};

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { packageName, orderId } = req.body;

    const price = packagePrices[packageName];

    if (!price) {
      return res.status(400).json({
        success: false,
        message: "Invalid package selected",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `NextStep CV - ${packageName} Package`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],

      metadata: {
        orderId: orderId || "",
        packageName,
      },

      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log("Stripe Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Stripe checkout failed",
      error: error.message,
    });
  }
});

export default router;