# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name:** e-education-platform (or your preferred name)
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to your users
5. Click "Create new project"
6. Wait for project to be created (takes 1-2 minutes)

## Step 2: Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
url=https://roqkcsuwyhbficcasggt.supabase.co
api key=sb_publishable_dVxm2vkroeRVWxrlbUtFwQ_TcUsSo-f
Secret keys=sb_secret_hTvLeDSHYknOEwJdEKfu1A_be6b6xhL
anon=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcWtjc3V3eWhiZmljY2FzZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDEzNzEsImV4cCI6MjA4NDExNzM3MX0.2hf-nKvalz5ZoHE9dx_zYMXQFlgJRd5s-GvQiurEphU
## Step 3: Update Configuration

1. Open `src/config/supabase.js`
2. Replace the dummy credentials:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co'; // Replace with your Project URL
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Replace with your anon key
```

## Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `database/supabase_schema.sql`
4. Paste into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. Wait for all tables to be created

## Step 5: Verify Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - users
   - subjects
   - videos
   - quizzes
   - questions
   - subscriptions
   - payments
   - progress
   - quiz_results

## Step 6: Create Admin User

### Option A: Using Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter:
   - **Email:** admin@edulearn.com
   - **Password:** admin123 (or your preferred password)
4. After creating, note the User ID (UUID)
5. Go to **SQL Editor** and run:

```sql
INSERT INTO public.users (id, name, email, role)
VALUES ('USER_ID_FROM_AUTH', 'Admin User', 'admin@edulearn.com', 'admin');
```

Replace `USER_ID_FROM_AUTH` with the actual UUID from step 4.

### Option B: Using Registration Flow

1. Start your React app
2. Register with admin@edulearn.com
3. Go to Supabase SQL Editor and run:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@edulearn.com';
```

## Step 7: Test Connection

1. Start your React app: `npm start`
2. Try logging in with admin credentials
3. Check Supabase dashboard → **Table Editor** → **users** to see if user was created

## Troubleshooting

### Error: "Invalid API key"
- Double-check your SUPABASE_URL and SUPABASE_ANON_KEY in `src/config/supabase.js`
- Make sure you copied the **anon/public** key, not the **service_role** key

### Error: "relation does not exist"
- Make sure you ran the SQL schema file completely
- Check if all tables were created in Table Editor

### Error: "permission denied"
- Check Row Level Security (RLS) policies
- Make sure you're authenticated when making requests
- Verify user role is set correctly

### Authentication not working
- Check Supabase → **Authentication** → **Settings**
- Ensure email authentication is enabled
- Check if email confirmation is required (disable for testing)

## Environment Variables (Optional)

For better security, you can use environment variables:

1. Create `.env` file in project root:
```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Update `src/config/supabase.js`:
```javascript
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
```

3. Add `.env` to `.gitignore` (don't commit secrets!)

## Next Steps

After setup:
1. Update payment gateway credentials (see `PAYMENT_SETUP.md`)
2. Test all CRUD operations
3. Set up email templates in Supabase (optional)
4. Configure storage buckets if you need file uploads (optional)

