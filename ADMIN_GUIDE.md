# Admin Guide - How to Use Admin Dashboard

## 🔐 Step 1: Login as Admin

1. Open the application: http://localhost:3000
2. Click on **"Login"** in the navigation bar
3. Enter admin credentials:
   - **Email:** `admin@edulearn.com`
   - **Password:** `admin123`
4. Click **"Login"**

After login, you'll see the **Admin Dashboard** link in the navbar.

---

## 📊 Step 2: Access Admin Dashboard

1. Click on **"Admin"** in the navigation bar (or go to `/admin`)
2. You'll see the Admin Dashboard with statistics:
   - Total Students
   - Active Subscriptions
   - Total Videos
   - Total Quizzes

---

## 📚 Step 3: Manage Subjects (Optional)

1. In Admin Dashboard, click on **"Subjects"** tab
2. You can:
   - **Add Subject:** Click "Add Subject" button
   - **Edit Subject:** Click edit icon on any subject card
   - **Delete Subject:** Click delete icon
   - **Enable/Disable:** Toggle subject availability
3. Default subjects (Math, Chemistry, Physics) are already created

---

## 🎥 Step 4: Upload YouTube Video Links

### How to Add Videos:

1. Click on **"Videos"** tab in Admin Dashboard
2. Click **"Add Video"** button (green button at top right)
3. Fill in the video form:

   **Required Fields:**
   - **Subject:** Select from dropdown (Math, Chemistry, or Physics)
   - **Video Title:** e.g., "Introduction to Algebra"
   - **YouTube URL:** Paste the full YouTube video URL
     - Format: `https://www.youtube.com/watch?v=VIDEO_ID`
     - Or: `https://youtu.be/VIDEO_ID`

   **Optional Fields:**
   - **Description:** Brief description of the video
   - **Topic/Chapter:** e.g., "Algebra", "Chapter 1"
   - **Order:** Number to sort videos (1, 2, 3...)
   - **Duration:** e.g., "15:30"

4. Click **"Add Video"** button to save
5. The video will appear in the videos list

### Example YouTube URLs:
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ`

### Edit or Delete Videos:
- Click **edit icon** (pencil) to modify a video
- Click **delete icon** (trash) to remove a video
- Click **external link icon** to open video in YouTube

---

## 📝 Step 5: Create Quizzes/Exams

### How to Create a Quiz:

1. Click on **"Quizzes"** tab in Admin Dashboard
2. Click **"Add Quiz"** button (green button at top right)
3. Fill in the quiz details:

   **Quiz Information:**
   - **Subject:** Select from dropdown
   - **Quiz Title:** e.g., "Algebra Chapter 1 Quiz"
   - **Description:** Brief description (optional)
   - **Quiz Type:** Choose from:
     - Practice
     - Chapter End
     - Final Exam
   - **Time Limit:** Enter minutes (e.g., 10)
   - **Passing Score:** Enter percentage (e.g., 70)

4. **Add Questions:**
   - Each question starts with a default of 4 options
   - Fill in the **Question Text**
   - Fill in **Options** (at least 2 required)
   - **Select correct answer** by clicking the radio button next to the correct option
   - Set **Points** for each question (default: 1)
   - Click **"Add Option"** to add more answer choices
   - Click **"Add Question"** to add another question
   - Click **minus icon** to remove a question or option

5. Click **"Create Quiz"** button to save

### Quiz Question Example:
```
Question: What is 2 + 2?
Options:
  ○ Option 1: 3
  ● Option 2: 4  (correct answer - selected)
  ○ Option 3: 5
  ○ Option 4: 6
Points: 1
```

### Edit or Delete Quizzes:
- Click **edit icon** (pencil) to modify a quiz
- Click **delete icon** (trash) to remove a quiz

---

## 👥 Step 6: View Students

1. Click on **"Students"** tab in Admin Dashboard
2. You'll see a list of all registered students
3. View their:
   - Name and Email
   - Registration Date
   - Subscription Status (Active/Inactive/Expired)
   - Subscription Expiry Date

---

## ✅ Quick Checklist

- [ ] Login with admin credentials
- [ ] Navigate to Admin Dashboard
- [ ] Verify subjects exist (Math, Chemistry, Physics)
- [ ] Add at least one YouTube video for each subject
- [ ] Create at least one quiz for each subject
- [ ] Check student list to see registered users

---

## 💡 Tips

1. **YouTube Videos:**
   - Always use the full YouTube URL
   - The system supports both `youtube.com/watch?v=` and `youtu.be/` formats
   - Test the URL by clicking the external link icon after adding

2. **Quizzes:**
   - Start with simple questions (2-3 options)
   - Always mark the correct answer with the radio button
   - Use descriptive question text
   - Set appropriate time limits (10-30 minutes for practice quizzes)

3. **Organization:**
   - Use topics/chapters to organize videos
   - Use order numbers to sequence videos within a topic
   - Create quizzes after uploading related videos

4. **Testing:**
   - After adding content, login as a student (`john@student.com`) to verify
   - Check that videos play correctly
   - Test quizzes to ensure answers are marked correctly

---

## 🆘 Troubleshooting

**Problem: Video not playing**
- Check if YouTube URL is correct and complete
- Ensure the video is publicly available (not private)

**Problem: Quiz not saving**
- Ensure at least one question is added
- All questions must have at least 2 options
- Correct answer must be selected for each question

**Problem: Can't see subjects dropdown**
- Click on "Subjects" tab first to initialize default subjects
- Or manually add subjects in the Subjects tab

---

**Need Help?** Check the main README.md for more information about the platform.

