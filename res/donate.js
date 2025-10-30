const stripe = Stripe('pk_test_51SEYoYDn7zRnsihsxizdby6oTeEaDjqQIUvFJGzsyUmnthmvIGy52tqMkP2mPjv46prUT5NWKHmCR0zRswOpD4kN00yOBEeKZV');
const donationInput = document.getElementById('donateAmount');
let donationValue = 0;
let setPrice = -1;
let elements = null;

initialize();
donationInput.addEventListener('input', initialize);
document.getElementById('payment-form').addEventListener('submit', handleSubmit);

// Fetches a payment intent and captures the client secret
function initialize() {
    setLoading(true);
    donationInput.value = donationValue = parseInt(donationInput.value) || 10;
    fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationValue: donationValue * 10, currency: 'eur' })
    }).then(res => res.json()).catch(err => console.log(err)).then(data => {
        const clientSecret = data.clientSecret;
        const appearance = { theme: 'stripe' };
        elements = stripe.elements({ appearance, clinetSecret });
        setPrice = donationValue;
        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');
        setLoading(false);
    }).catch(err => console.log(err));
}

async function handleSubmit(e) {
    if (setPrice !== donationValue) return;
    e.preventDefault();
    setLoading(true);
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // TODO: Change this to your payment completion page
            return_url: 'https://your-website.com/order/complete',
        },
    });
    showMessage(error.type in ['card_error', 'validation_error'] ? error.message : 'An unexpected error occurred.');
    setLoading(false);
}

// ------- UI helpers -------
function showMessage(messageText) {
    const messageContainer = document.getElementById('payment-message');
    messageContainer.textContent = messageText;
    messageContainer.classList.remove('hidden');
    setTimeout(() => messageContainer.classList.add('hidden'), 5000);
}

function setLoading(isLoading) { // Disable the button and show a spinner if loading
    document.getElementById('submit').disabled = isLoading;
    document.getElementById('spinner').classList.toggle('hidden', !isLoading);
    document.getElementById('button-text').classList.toggle('hidden', isLoading);
}