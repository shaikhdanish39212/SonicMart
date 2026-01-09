import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PermissionsContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export const PermissionsProvider = ({ children }) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Define role-based permissions
  const rolePermissions = {
    admin: {
      canManageUsers: true,
      canManageProducts: true,
      canManageOrders: true,
      canManageDeals: true,
      canViewAnalytics: true,
      canManageCategories: true,
      canManageSettings: true,
      canDeleteUsers: true,
      canDeleteProducts: true,
      canDeleteOrders: false, // Orders usually shouldn't be deleted
      canRefundOrders: true,
      canEditOrders: true,
      canExportData: true,
      canImportData: true,
    },
    moderator: {
      canManageUsers: false,
      canManageProducts: true,
      canManageOrders: true,
      canManageDeals: true,
      canViewAnalytics: true,
      canManageCategories: true,
      canManageSettings: false,
      canDeleteUsers: false,
      canDeleteProducts: false,
      canDeleteOrders: false,
      canRefundOrders: false,
      canEditOrders: true,
      canExportData: true,
      canImportData: false,
    },
    user: {
      canManageUsers: false,
      canManageProducts: false,
      canManageOrders: false,
      canManageDeals: false,
      canViewAnalytics: false,
      canManageCategories: false,
      canManageSettings: false,
      canDeleteUsers: false,
      canDeleteProducts: false,
      canDeleteOrders: false,
      canRefundOrders: false,
      canEditOrders: false,
      canExportData: false,
      canImportData: false,
    },
  };

  useEffect(() => {
    if (user) {
      const userRole = user.role || 'user';
      setPermissions(rolePermissions[userRole] || rolePermissions.user);
    } else {
      setPermissions({});
    }
    setLoading(false);
  }, [user]);

  // Helper function to check if user has specific permission
  const hasPermission = (permission) => {
    return permissions[permission] || false;
  };

  // Helper function to check if user has any of the specified permissions
  const hasAnyPermission = (permissionsList) => {
    return permissionsList.some(permission => hasPermission(permission));
  };

  // Helper function to check if user has all specified permissions
  const hasAllPermissions = (permissionsList) => {
    return permissionsList.every(permission => hasPermission(permission));
  };

  const value = {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: user?.role || null,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext;