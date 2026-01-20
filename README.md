# E-Education Platform

A modern, responsive E-Education Web Application for online learning with support for Mathematics, Chemistry, and Physics subjects.

## Features

### User Roles

#### Admin (Teacher)
- Secure admin login
- Manage subjects (add, edit, delete)
- Upload and manage YouTube video links
- Create and manage quizzes/exams (MCQs, true/false)
- View student subscription status
- Enable/disable content access

**Default Admin Credentials:**
- Email: `admin@edulearn.com`
- Password: `admin123`

**Test Student Accounts:**
- **Paid Student:** `john@student.com` / `student123` (Active Subscription)
- **Free Student:** `jane@student.com` / `student123` (No Subscription)
- **Expired Student:** `mike@student.com` / `student123` (Expired Subscription)

> See `TEST_ACCOUNTS.md` for detailed test account information.

#### Student
- User registration and login
- Monthly subscription payment system
- Access to video lectures (for paid users)
- Take quizzes and exams (for paid users)
- Progress tracking
- View locked content with subscription prompts (for free users)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone or download the project:**
   ```bash
   cd e-education-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Supabase Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your Project URL and anon key from Settings → API

2. **Update Configuration:**
   - Open `src/config/supabase.js`
   - Replace the placeholder values with your Supabase credentials:
     ```javascript
     const SUPABASE_URL = 'https://your-project-id.supabase.co';
     const SUPABASE_ANON_KEY = 'your-anon-key-here';
     ```

3. **Run Database Schema:**
   - Go to Supabase Dashboard → SQL Editor
   - Copy the entire contents of `database/supabase_schema.sql`
   - Paste and run the SQL to create all tables

4. **Create Admin User:**
   - In Supabase Dashboard → Authentication → Users → Add User
   - Email: `admin@edulearn.com`
   - Password: `admin123`
   - Copy the User ID (UUID)
   - Run this SQL in SQL Editor:
     ```sql
     INSERT INTO public.users (id, name, email, role)
     VALUES ('PASTE_UUID_HERE', 'Admin User', 'admin@edulearn.com', 'admin');
     ```

5. **Configure Email Settings (Optional):**
   - **For Email Confirmation:** Go to Authentication → Email → Enable "Enable email confirmations"
   - **For Custom SMTP:** Go to Authentication → Email → Enable Custom SMTP
     - Configure your SMTP provider (SendGrid, Mailgun, etc.)
     - Set sender email, host, port, credentials
     - This improves email deliverability for production

### Development Server

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

### Initial Content Setup

1. **Login as Admin:**
   - Email: `admin@edulearn.com`
   - Password: `admin123`

2. **Add Subjects (if needed):**
   - Go to Admin Dashboard → Subjects
   - Add Mathematics, Chemistry, Physics

3. **Add Sample Content:**
   - Add YouTube videos via Videos tab
   - Create quizzes via Quizzes tab

### Testing

#### **Registration Testing:**

**Option A: Instant Registration (No Email Confirmation)**
1. Keep email confirmation **disabled** in Supabase
2. Register new user → Should login immediately → Redirect to dashboard

**Option B: Email Confirmation Registration**
1. **Enable email confirmation** in Supabase Authentication → Email
2. Register new user → See "check email" message
3. Check email inbox → Click confirmation link
4. Should auto-login and redirect to dashboard

#### **Full Testing Flow:**
- **Test Student Registration:** Create a new student account
- **Test Admin Login:** Use `admin@edulearn.com` / `admin123`
- **Test Subscription:** Complete the mock payment flow
- **Test Content Access:** Verify videos and quizzes work for paid users
- **Test Admin Functions:** Add subjects, videos, quizzes as admin

## Project Structure

```
src/
├── components/
│   ├── Admin/          # Admin dashboard components
│   │   ├── AdminDashboard.jsx
│   │   ├── SubjectManager.jsx
│   │   ├── VideoManager.jsx
│   │   ├── QuizManager.jsx
│   │   └── StudentManager.jsx
│   ├── Auth/           # Authentication components
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Common/         # Shared components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LockedContent.jsx
│   │   └── LoadingSpinner.jsx
│   └── Student/        # Student dashboard components
│       ├── StudentDashboard.jsx
│       ├── SubjectCard.jsx
│       ├── VideoPlayer.jsx
│       ├── QuizComponent.jsx
│       └── PaymentModal.jsx
├── context/            # React Context providers
│   ├── AuthContext.js
│   └── PaymentContext.js
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Pricing.jsx
│   ├── SubjectPage.jsx
│   └── QuizPage.jsx
├── services/           # API/service layer
│   ├── authService.js
│   ├── paymentService.js
│   └── subjectService.js
├── styles/             # Styling files
│   ├── App.css
│   └── theme.css
└── utils/              # Utility functions
    ├── constants.js
    └── helpers.js
```

## Usage

### For Administrators

1. **Login as Admin:**
   - Use the default admin credentials provided above
   - Navigate to the Admin Dashboard

2. **Manage Subjects:**
   - Click on "Subjects" tab
   - Add, edit, or delete subjects
   - Enable/disable subjects

3. **Manage Videos:**
   - Click on "Videos" tab
   - Add YouTube video links for each subject
   - Organize videos by chapters/topics

4. **Manage Quizzes:**
   - Click on "Quizzes" tab
   - Create quizzes with multiple choice questions
   - Set correct answers and marks
   - Configure passing scores

5. **View Students:**
   - Click on "Students" tab
   - View all registered students
   - Check subscription status

### For Students

1. **Register/Login:**
   - Create a new account or login with existing credentials

2. **Subscribe:**
   - Navigate to Pricing page
   - Choose a subscription plan
   - Complete payment (mock payment for demo)

3. **Access Content:**
   - Browse subjects from Dashboard
   - Watch video lectures
   - Take quizzes and exams

## Technologies Used

- **React** - UI library
- **React Router** - Routing
- **Styled Components** - CSS-in-JS styling
- **React Player** - Video player component
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **LocalStorage** - Data persistence (mock backend)

## Payment Integration

The platform includes mock payment integration. To integrate real payment gateways:

1. **Stripe:** Update `paymentService.js` with Stripe API keys
2. **PayPal:** Add PayPal SDK integration
3. **Razorpay:** Configure Razorpay payment gateway

## Data Storage

Currently, the application uses localStorage for data persistence. In a production environment, you should:

1. Replace localStorage calls with API calls to a backend
2. Implement proper authentication (JWT tokens)
3. Use a database (MongoDB, PostgreSQL, etc.)
4. Implement server-side validation

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Deployment

### Prerequisites
- Built application (`npm run build`)
- Supabase project configured
- Deployment platform account (Vercel, Netlify, etc.)

### Environment Variables
Create a `.env` file in the root directory with your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Update `src/config/supabase.js` to use environment variables:

```javascript
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
```

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deployment Options

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts to link your project
   - Set environment variables in Vercel dashboard

3. **Alternative: Git Integration**
   - Push code to GitHub/GitLab
   - Connect repository to Vercel
   - Deploy automatically on push

#### Option 2: Netlify

1. **Drag & Drop:**
   - Go to [Netlify](https://netlify.com)
   - Drag the `build` folder to the deployment area

2. **Git Integration:**
   - Connect your Git repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in site settings

#### Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json:**
   ```json
   "scripts": {
     "deploy": "gh-pages -d build"
   }
   ```

3. **Deploy:**
   ```bash
   npm run build
   npm run deploy
   ```

### Post-Deployment Setup

1. **Update Supabase CORS settings:**
   - Go to Supabase Dashboard → Settings → API
   - Add your deployment domain to allowed origins

2. **Test the deployment:**
   - Verify login functionality
   - Test video playback
   - Check quiz functionality
   - Ensure payment flow works

## Features Implementation Status

✅ User Authentication (Login/Register)
✅ Role-based Access Control
✅ Subject Management
✅ Video Management (YouTube Integration)
✅ Quiz/Exam Creation
✅ Subscription System (Mock Payment)
✅ Progress Tracking
✅ Responsive Design
⏳ Certificate Generation (Optional)
⏳ Email Notifications (Optional)
⏳ Dark Mode Toggle (CSS support added)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@edulearn.com or create an issue in the repository.
