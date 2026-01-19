# Installation & Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier works)
- Payment gateway account (optional for testing)

## Step 1: Install Dependencies

```bash
cd e-education-platform
npm install
```

This will install:
- React and React DOM
- React Router
- Supabase client
- Stripe JS (for payments)
- Other dependencies

## Step 2: Set Up Supabase

1. Follow the instructions in `SUPABASE_SETUP.md`
2. Get your Supabase URL and anon key
3. Update `src/config/supabase.js` with your credentials
4. Run the SQL schema from `database/supabase_schema.sql`

## Step 3: Configure Payment Gateways (Optional)

1. Follow the instructions in `PAYMENT_SETUP.md`
2. Update `src/services/paymentGateway.js` with your credentials
3. Set up backend API endpoints (see PAYMENT_SETUP.md)

## Step 4: Start Development Server

```bash
npm start
```

The app will open at http://localhost:3000

## Step 5: Test the Application

### Test Accounts

**Admin:**
- Email: `admin@edulearn.com`
- Password: `admin123`

**Students:**
- `john@student.com` / `student123` (paid)
- `jane@student.com` / `student123` (free)
- `mike@student.com` / `student123` (expired)

See `TEST_ACCOUNTS.md` for more details.

## Troubleshooting

### Supabase Connection Issues

If you see "Invalid API key" errors:
1. Check your Supabase credentials in `src/config/supabase.js`
2. Make sure you copied the **anon/public** key, not service_role key
3. Verify your Supabase project is active

### Payment Gateway Issues

If payments aren't working:
1. Check payment gateway credentials
2. Verify backend API endpoints are set up
3. Check browser console for errors
4. The app will fall back to mock payments if APIs aren't configured

### Database Errors

If you see "relation does not exist":
1. Make sure you ran the SQL schema file completely
2. Check Supabase dashboard → Table Editor to verify tables exist
3. Verify RLS policies are set up correctly

## Development Mode

The app works in two modes:

1. **Supabase Mode** (Production): Uses Supabase for all data
2. **Mock Mode** (Development): Falls back to localStorage if Supabase isn't configured

You can develop without Supabase, but you'll need it for production.

## Next Steps

1. Set up your Supabase project
2. Configure payment gateways
3. Customize the UI/UX
4. Add your content (videos, quizzes)
5. Deploy to production

## Environment Variables (Optional)

Create a `.env` file:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_PAYPAL_CLIENT_ID=...
REACT_APP_RAZORPAY_KEY_ID=rzp_test_...
```

Then update `src/config/supabase.js` to use:
```javascript
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
```

**Important:** Add `.env` to `.gitignore` to avoid committing secrets!

