import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useRBAC } from '../context/RBACContext';

const ProtectedRoute = ({ children, adminOnly = false, moderatorOnly = false, requiredPermission, requiredPermissions, requireAllPermissions = false, requiredRole, requiredRoles, minRoleLevel, redirectTo = '/login', unauthorizedRedirect = '/unauthorized' }) => {
  const { user, loading: authLoading, isAuthenticated } = useContext(AuthContext);
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole, isAdmin, isModerator, canAccess, loading: rbacLoading } = useRBAC();

  // Show loading while auth or RBAC is initializing
  if (authLoading || rbacLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access
  if (adminOnly && !isAdmin()) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }
  if (moderatorOnly && !isModerator()) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }
  if (minRoleLevel !== undefined && !canAccess(minRoleLevel)) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }
  if (requiredPermissions) {
    const hasAccess = requireAllPermissions 
      ? hasAllPermissions(requiredPermissions) 
      : hasAnyPermission(requiredPermissions);
    if (!hasAccess) {
      return <Navigate to={unauthorizedRedirect} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;