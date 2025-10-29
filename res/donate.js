const stripe = Stripe('pk_test_51SEYoYDn7zRnsihsxizdby6oTeEaDjqQIUvFJGzsyUmnthmvIGy52tqMkP2mPjv46prUT5NWKHmCR0zRswOpD4kN00yOBEeKZV');
const donationInput = document.getElementById('donateAmount');
let donationValue = parseInt(donationInput.value) || 10;
let setPrice = -1;
donationInput.addEventListener('input', async e => {
    setLoading(true);
    donationValue = parseInt(e.target.value) || 10;
    await initialize();
    setLoading(false);
});
let currency = 'eur';
let elements;

initialize();
document.querySelector("#payment-form").addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
    setPrice = donationValue;
    const response = await fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationValue: donationValue * 10, currency: currency })
    });
    const { clientSecret } = await response.json();

    const appearance = { theme: 'stripe' };
    elements = stripe.elements({ appearance, clientSecret });

    const paymentElement = elements.create("payment", {
        layout: "accordion"
    });
    paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
    if (setPrice !== donationValue) return;

    e.preventDefault();
    setLoading(true);

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // TODO: Change this to your payment completion page
            return_url: "https://your-website.com/order/complete",
        },
    });

    if (error.type === "card_error" || error.type === "validation_error") showMessage(error.message);
    else showMessage("An unexpected error occurred.");

    setLoading(false);
}

// ------- UI helpers -------
function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
        return;
    }
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
}