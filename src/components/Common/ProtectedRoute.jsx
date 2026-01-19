import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin, hasActiveSubscription } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  if (!requireAdmin && !isAdmin() && !hasActiveSubscription()) {
    // Allow access to dashboard but content will be locked
    return children;
  }

  return children;
}

export default ProtectedRoute;