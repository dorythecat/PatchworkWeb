const express = require("express");
const app = express();
const stripe = require("stripe")(STRIPE_SECRET_KEY);

app.use(express.static("./"));
app.use(express.json());
app.post("/create-payment-intent", (req, res) => {
    stripe.paymentIntents.create({
        amount: req.body.donationValue,
        currency: req.body.currency
    }).catch(err => {
        console.log(err);
        res.status(500).send({ error: err.message });
    }).then(paymentIntent => res.status(200).send({ clientSecret: paymentIntent.client_secret }));
});
app.listen(4242, () => console.log("Node server listening on port 4242!"));