# Quick Start Guide - Launch Tomorrow

## 🚀 Fast Setup (30 minutes)

### Step 1: Install Dependencies (2 min)
```bash
cd e-education-platform
npm install
```

### Step 2: Supabase Setup (10 min)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Wait for setup (2 minutes)

2. **Get Credentials**
   - Settings → API
   - Copy Project URL and anon key

3. **Update Config**
   - Open `src/config/supabase.js`
   - Replace with your credentials:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

4. **Run Database Schema**
   - Supabase Dashboard → SQL Editor
   - Copy entire `database/supabase_schema.sql`
   - Paste and Run

5. **Create Admin User**
   - Authentication → Users → Add User
   - Email: admin@edulearn.com
   - Password: admin123
   - Copy User ID (UUID)
   - SQL Editor → Run:
   ```sql
   INSERT INTO public.users (id, name, email, role)
   VALUES ('PASTE_USER_ID_HERE', 'Admin User', 'admin@edulearn.com', 'admin');
   ```

### Step 3: Add Content (10 min)

1. **Start App**
   ```bash
   npm start
   ```

2. **Login as Admin**
   - Email: admin@edulearn.com
   - Password: admin123

3. **Add Videos**
   - Go to Admin → Videos
   - Click "Add Video"
   - Add at least 2-3 videos per subject
   - Use real YouTube URLs

4. **Create Quizzes**
   - Go to Admin → Quizzes
   - Click "Add Quiz"
   - Add 3-5 questions per quiz
   - Set correct answers

### Step 4: Test Everything (5 min)

1. **Test Student Flow**
   - Logout
   - Register new account
   - Try to access content (should be locked)
   - Go to Pricing → Subscribe (mock payment)
   - Access videos and quizzes

2. **Verify**
   - Videos play
   - Quizzes work
   - Results display
   - Progress tracks

### Step 5: Build for Production (3 min)

```bash
npm run build
```

Test the build:
```bash
npx serve -s build
```

---

## ⚡ Quick Fixes

### If Supabase Not Working
- App falls back to localStorage automatically
- You can launch without Supabase (but data won't persist)

### If Videos Don't Play
- Check YouTube URLs are correct
- Ensure URLs are public (not private)

### If Quizzes Don't Work
- Verify questions have correct answers set
- Check at least 2 options per question

---

## 🎯 Minimum Viable Launch

**Must Have:**
- ✅ Admin can login
- ✅ Admin can add videos
- ✅ Admin can create quizzes
- ✅ Students can register/login
- ✅ Students can subscribe (mock payment OK)
- ✅ Students can watch videos
- ✅ Students can take quizzes

**Nice to Have:**
- Real payment gateway
- Email notifications
- Progress tracking
- Certificates

---

## 📋 Launch Day Checklist

- [ ] Supabase configured
- [ ] Admin account created
- [ ] At least 5 videos added
- [ ] At least 3 quizzes created
- [ ] Test student account works
- [ ] Payment flow works (mock OK)
- [ ] Build successful
- [ ] Deployed to hosting
- [ ] Domain configured (if using)
- [ ] Test on live site

---

## 🆘 Emergency Fixes

**Error: "Cannot read properties of undefined"**
- Check data structure matches expected format
- Verify Supabase tables have data

**Error: "Invalid API key"**
- Double-check Supabase credentials
- Ensure anon key (not service_role)

**Videos not loading**
- Check YouTube URLs
- Verify React Player is installed

**Quizzes not saving**
- Check database connection
- Verify RLS policies allow inserts

---

## 📞 Support

- Check browser console for errors
- Check Supabase logs
- Review PRE_LAUNCH_CHECKLIST.md
- Test in incognito mode

**You're ready to launch! 🚀**
