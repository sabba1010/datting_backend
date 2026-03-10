const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const mode = 'sandbox';

console.log(`Testing PayPal in ${mode} mode...`);
console.log(`Client ID: ${clientId.substring(0, 5)}...`);

const environment = mode === 'live'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

const client = new paypal.core.PayPalHttpClient(environment);

async function testPaypal() {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: '1.00'
                },
                description: 'Test Order'
            }]
        });

        console.log('Executing test order creation...');
        const order = await client.execute(request);
        console.log('Order created successfully!');
        console.log('Order ID:', order.result.id);
        console.log('Status:', order.result.status);
    } catch (err) {
        console.error('PayPal Test Error:');
        if (err.statusCode) console.error('Status Code:', err.statusCode);
        try {
            const errorDetails = JSON.parse(err.message);
            console.error('Details:', JSON.stringify(errorDetails, null, 2));
        } catch (e) {
            console.error('Message:', err.message);
        }
    }
}

testPaypal();
