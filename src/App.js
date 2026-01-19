import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import SubjectPage from './pages/SubjectPage';
import QuizPage from './pages/QuizPage';
import Pricing from './pages/Pricing';
import AdminDashboard from './components/Admin/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Student Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/subject/:subjectId" element={
                <ProtectedRoute>
                  <SubjectPage />
                </ProtectedRoute>
              } />
              <Route path="/quiz/:quizId" element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" />
        </div>
      </PaymentProvider>
    </AuthProvider>
  );
}

export default App;