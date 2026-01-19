export const SUBJECTS = {
  MATH: {
    id: 'math',
    name: 'Mathematics',
    color: '#4CAF50',
    icon: '🧮',
    description: 'Algebra, Calculus, Geometry, Statistics'
  },
  CHEMISTRY: {
    id: 'chemistry',
    name: 'Chemistry',
    color: '#2196F3',
    icon: '🧪',
    description: 'Organic, Inorganic, Physical Chemistry'
  },
  PHYSICS: {
    id: 'physics',
    name: 'Physics',
    color: '#FF9800',
    icon: '⚛️',
    description: 'Mechanics, Thermodynamics, Electromagnetism'
  }
};

export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student'
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

export const QUIZ_TYPES = {
  PRACTICE: 'practice',
  CHAPTER_END: 'chapter_end',
  FINAL_EXAM: 'final_exam'
};

export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  RAZORPAY: 'razorpay'
};

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  SUBJECTS: '/api/subjects',
  VIDEOS: '/api/videos',
  QUIZZES: '/api/quizzes',
  PAYMENTS: '/api/payments',
  SUBSCRIPTIONS: '/api/subscriptions',
  PROGRESS: '/api/progress'
};