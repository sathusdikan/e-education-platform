# Test Accounts for E-Education Platform

Here are all the dummy test accounts you can use to test the system:

## 🔐 Login Credentials

### 👨‍💼 Admin Account
**Use this to manage the platform:**
- **Email:** `admin@edulearn.com`
- **Password:** `admin123`
- **Role:** Admin
- **Features:** Full access to admin dashboard, can manage subjects, videos, quizzes, and view students

---

### 👨‍🎓 Student Accounts

#### 1. Student with Active Subscription ✅
**Use this to test paid student features:**
- **Email:** `john@student.com`
- **Password:** `student123`
- **Role:** Student
- **Subscription:** Active (expires in 15 days)
- **Features:** Full access to all videos, quizzes, and exams

---

#### 2. Student without Subscription (Free User) 🔓
**Use this to test locked content features:**
- **Email:** `jane@student.com`
- **Password:** `student123`
- **Role:** Student
- **Subscription:** Inactive
- **Features:** Can view homepage and dashboard but content is locked. Will see "Subscribe to Access" prompts.

---

#### 3. Student with Expired Subscription ⏰
**Use this to test expired subscription handling:**
- **Email:** `mike@student.com`
- **Password:** `student123`
- **Role:** Student
- **Subscription:** Expired (expired 30 days ago)
- **Features:** Similar to free user - content is locked, needs to renew subscription

---

## 📋 Testing Scenarios

### Test as Admin:
1. Login with `admin@edulearn.com` / `admin123`
2. Go to Admin Dashboard
3. Add/Edit/Delete subjects
4. Upload YouTube video links
5. Create quizzes with questions
6. View student list and subscription status

### Test as Paid Student:
1. Login with `john@student.com` / `student123`
2. Access all subjects (Math, Chemistry, Physics)
3. Watch video lectures
4. Take quizzes and exams
5. View progress tracking

### Test as Free Student:
1. Login with `jane@student.com` / `student123`
2. Try to access subjects - see locked content
3. Click on videos - see "Subscribe to Access" message
4. Try to take quiz - blocked
5. Go to Pricing page and subscribe (mock payment)

### Test Registration:
1. Go to Register page
2. Create a new account
3. Login with new credentials
4. Start with free account (no subscription)
5. Subscribe from Pricing page

---

## 🚀 Quick Start Guide

1. **Start the application:**
   ```bash
   npm start
   ```

2. **Open browser:** http://localhost:3000

3. **Try different accounts:**
   - Test admin features
   - Test paid student features  
   - Test free student features
   - Test subscription flow

---

## 💡 Tips

- All passwords for test accounts are: `student123` (easy to remember!)
- Admin password: `admin123`
- You can also register new accounts to test the registration flow
- Mock payment always succeeds - just click "Pay" and subscription activates
- All data is stored in browser localStorage (clears on cache clear)

---

**Note:** These are test accounts created automatically on first load. You can modify or delete them through the admin dashboard.

