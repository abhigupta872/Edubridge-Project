import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.token) {
    // User is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User role is not authorized for this route
    // Redirect them to a default page depending on their role
    switch (user.role) {
      case 'STUDENT':
        return <Navigate to="/student-dashboard" replace />;
      case 'MENTOR':
        return <Navigate to="/mentor-dashboard" replace />;
      case 'RECRUITER':
        return <Navigate to="/recruiter-dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
