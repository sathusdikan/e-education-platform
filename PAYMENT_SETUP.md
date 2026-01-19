# Payment Gateway Setup Guide

This guide explains how to set up payment gateways (Stripe, PayPal, Razorpay) for the E-Education Platform.

## Overview

The platform supports three payment gateways:
- **Stripe** - Best for international payments (USD, EUR, etc.)
- **PayPal** - Popular worldwide
- **Razorpay** - Best for India (INR)

You can enable one or all of them.

---

## Stripe Setup

### Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for an account
3. Complete account verification

### Step 2: Get API Keys

1. Go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

### Step 3: Update Configuration

Open `src/services/paymentGateway.js` and update:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_key_here';
const STRIPE_SECRET_KEY = 'sk_test_your_actual_key_here';
```

**Note:** Secret key should only be used on backend. For frontend, only use publishable key.

### Step 4: Install Stripe (if using Stripe Elements)

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Step 5: Backend API Endpoints

You'll need to create backend endpoints:

**POST `/api/payments/stripe/create-intent`**
```javascript
// Backend example (Node.js/Express)
app.post('/api/payments/stripe/create-intent', async (req, res) => {
  const { amount, currency, metadata } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // in cents
    currency: currency.toLowerCase(),
    metadata: metadata
  });
  
  res.json({
    clientSecret: paymentIntent.client_secret,
    paymentId: paymentIntent.id
  });
});
```

**POST `/api/payments/stripe/confirm/:paymentIntentId`**
```javascript
app.post('/api/payments/stripe/confirm/:paymentIntentId', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(req.params.paymentIntentId);
  res.json({ status: paymentIntent.status });
});
```

---

## PayPal Setup

### Step 1: Create PayPal Developer Account

1. Go to [https://developer.paypal.com](https://developer.paypal.com)
2. Sign up or log in
3. Create a new app

### Step 2: Get Credentials

1. Go to **My Apps & Credentials**
2. Create a new app (Sandbox for testing)
3. Copy:
   - **Client ID**
   - **Client Secret**

### Step 3: Update Configuration

Open `src/services/paymentGateway.js`:

```javascript
const PAYPAL_CLIENT_ID = 'your_paypal_client_id_here';
const PAYPAL_CLIENT_SECRET = 'your_paypal_client_secret_here';
```

### Step 4: Backend API Endpoints

**POST `/api/payments/paypal/create-order`**
```javascript
// Backend example
app.post('/api/payments/paypal/create-order', async (req, res) => {
  const { amount, currency, planId } = req.body;
  
  const order = await paypal.orders.create({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toString()
      }
    }]
  });
  
  res.json({
    orderId: order.id,
    approvalUrl: order.links.find(link => link.rel === 'approve').href
  });
});
```

**POST `/api/payments/paypal/capture/:orderId`**
```javascript
app.post('/api/payments/paypal/capture/:orderId', async (req, res) => {
  const capture = await paypal.orders.capture(req.params.orderId);
  res.json({ status: capture.status });
});
```

---

## Razorpay Setup

### Step 1: Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up for an account
3. Complete KYC verification

### Step 2: Get API Keys

1. Go to **Settings** → **API Keys**
2. Generate test keys
3. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**

### Step 3: Update Configuration

Open `src/services/paymentGateway.js`:

```javascript
const RAZORPAY_KEY_ID = 'rzp_test_your_key_id_here';
const RAZORPAY_KEY_SECRET = 'your_key_secret_here';
```

### Step 4: Install Razorpay (optional)

```bash
npm install razorpay
```

### Step 5: Backend API Endpoints

**POST `/api/payments/razorpay/create-order`**
```javascript
// Backend example
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

app.post('/api/payments/razorpay/create-order', async (req, res) => {
  const { amount, currency, metadata } = req.body;
  
  const order = await razorpay.orders.create({
    amount: amount, // in paise (for INR)
    currency: currency,
    receipt: `receipt_${Date.now()}`
  });
  
  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency
  });
});
```

**POST `/api/payments/razorpay/verify`**
```javascript
const crypto = require('crypto');

app.post('/api/payments/razorpay/verify', async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  
  const text = orderId + '|' + paymentId;
  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  
  const verified = generatedSignature === signature;
  res.json({ verified });
});
```

---

## Testing Payments

### Stripe Test Cards

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Use any future expiry date and any CVC

### PayPal Sandbox

- Use PayPal sandbox test accounts
- Create buyer and seller accounts in PayPal dashboard

### Razorpay Test

- Use test mode keys
- Test cards provided in Razorpay dashboard

---

## Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify payments** on backend before activating subscriptions
3. **Use HTTPS** in production
4. **Validate amounts** on backend (don't trust frontend)
5. **Store payment records** in database for audit trail
6. **Implement webhooks** for payment status updates

---

## Environment Variables

For production, use environment variables:

```env
# Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_... # Backend only

# PayPal
REACT_APP_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=... # Backend only

# Razorpay
REACT_APP_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=... # Backend only
```

---

## Current Implementation

The current implementation uses **mock payments** for development. To enable real payments:

1. Set up your chosen payment gateway(s)
2. Update credentials in `src/services/paymentGateway.js`
3. Create backend API endpoints (see examples above)
4. Update API URLs in `paymentGateway.js` to point to your backend
5. Test thoroughly in sandbox/test mode before going live

---

## Support

- Stripe Docs: https://stripe.com/docs
- PayPal Docs: https://developer.paypal.com/docs
- Razorpay Docs: https://razorpay.com/docs

