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

### Installation

1. Navigate to the project directory:
```bash
cd e-education-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
