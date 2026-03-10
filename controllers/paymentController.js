const paypal = require('@paypal/checkout-server-sdk');
const Plan = require('../models/Plan');
const User = require('../models/User');

// Helper to get PayPal client (initializes once)
let _paypalClient = null;
const getPaypalClient = () => {
    if (_paypalClient) return _paypalClient;

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE || 'sandbox';

    if (!clientId || !clientSecret) {
        console.error('[PayPal] CRITICAL ERROR: PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not found in environment!');
    }

    const environment = mode === 'live'
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    _paypalClient = new paypal.core.PayPalHttpClient(environment);
    console.log(`[PayPal] SDK initialized in ${mode} environment`);
    return _paypalClient;
};

const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        console.log(`[PayPal] Attempting to create order for planId: ${planId}`);
        const plan = await Plan.findById(planId);

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: plan.price.toFixed(2)
                },
                description: `Subscription: ${plan.name}`
            }]
        });

        const client = getPaypalClient();
        const order = await client.execute(request);
        console.log(`[PayPal] Order created successfully: ${order.result.id}`);
        res.json({ success: true, id: order.result.id });
    } catch (err) {
        console.error('[PayPal] Create order error:', err);
        let errorMessage = 'Could not create PayPal order';

        if (err.message) {
            try {
                const details = JSON.parse(err.message);
                console.error('[PayPal] Error Details:', JSON.stringify(details, null, 2));
                if (details.message) errorMessage += `: ${details.message}`;
            } catch (e) {
                console.error('[PayPal] Error Message:', err.message);
                errorMessage += `: ${err.message}`;
            }
        }

        res.status(500).json({ success: false, message: errorMessage, error: err.message });
    }
};

const captureOrder = async (req, res) => {
    try {
        const { orderId, planId } = req.body;
        const userId = req.user.id;

        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        const client = getPaypalClient();
        const capture = await client.execute(request);

        if (capture.result.status === 'COMPLETED') {
            const plan = await Plan.findById(planId);
            if (!plan) {
                return res.status(404).json({ success: false, message: 'Plan not found after payment' });
            }

            let expiryDate = new Date();
            if (plan.durationUnit === 'day') {
                expiryDate.setDate(expiryDate.getDate() + plan.duration);
            } else if (plan.durationUnit === 'week') {
                expiryDate.setDate(expiryDate.getDate() + (plan.duration * 7));
            } else if (plan.durationUnit === 'month') {
                expiryDate.setMonth(expiryDate.getMonth() + plan.duration);
            } else if (plan.durationUnit === 'year') {
                expiryDate.setFullYear(expiryDate.getFullYear() + plan.duration);
            }

            const user = await User.findByIdAndUpdate(userId, {
                plan: planId,
                subscriptionStatus: 'active',
                subscriptionExpiry: expiryDate
            }, { new: true }).populate('plan');

            return res.json({
                success: true,
                message: `Paiement réussi ! Abonnement ${plan.name} activé.`,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    plan: user.plan,
                    subscriptionStatus: user.subscriptionStatus,
                    subscriptionExpiry: user.subscriptionExpiry
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Le paiement n\'a pas pu être finalisé.' });
        }
    } catch (err) {
        console.error('PayPal capture order error:', err);
        res.status(500).json({ success: false, message: 'Erreur lors de la capture du paiement', error: err.message });
    }
};

module.exports = { createOrder, captureOrder };
