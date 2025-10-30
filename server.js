const express = require("express");
const app = express();
const stripe = require("stripe")(STRIPE_SECRET_KEY);

app.use(express.static("./"));
app.use(express.json());
app.post("/create-payment-intent", async (req, res) => {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.donationValue,
        currency: req.body.currency
    });
    res.send({ clientSecret: paymentIntent.client_secret, });
});
app.listen(4242, () => console.log("Node server listening on port 4242!"));