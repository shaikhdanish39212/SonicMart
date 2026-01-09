import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

// Define roles and their permissions
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
};

// Define permissions
const PERMISSIONS = {
  // User management
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  MANAGE_USER_ROLES: 'manage_user_roles',
  
  // Product management
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCTS: 'create_products',
  EDIT_PRODUCTS: 'edit_products',
  DELETE_PRODUCTS: 'delete_products',
  MANAGE_INVENTORY: 'manage_inventory',
  
  // Order management
  VIEW_ORDERS: 'view_orders',
  VIEW_ALL_ORDERS: 'view_all_orders',
  EDIT_ORDERS: 'edit_orders',
  CANCEL_ORDERS: 'cancel_orders',
  PROCESS_REFUNDS: 'process_refunds',
  
  // Analytics and reports
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_REPORTS: 'view_reports',
  EXPORT_DATA: 'export_data',
  
  // System settings
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_PROMOTIONS: 'manage_promotions',
  
  // Content management
  MANAGE_CONTENT: 'manage_content',
  MODERATE_REVIEWS: 'moderate_reviews',
  MANAGE_NOTIFICATIONS: 'manage_notifications',
  
  // Location tracking
  VIEW_LOCATION_DATA: 'view_location_data',
  MANAGE_TRACKING: 'manage_tracking',
  VIEW_HISTORICAL_DATA: 'view_historical_data'
};

// Role-Permission mapping
const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.EDIT_PRODUCTS,
    PERMISSIONS.DELETE_PRODUCTS,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.EDIT_ORDERS,
    PERMISSIONS.CANCEL_ORDERS,
    PERMISSIONS.PROCESS_REFUNDS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_PROMOTIONS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MODERATE_REVIEWS,
    PERMISSIONS.MANAGE_NOTIFICATIONS,
    PERMISSIONS.VIEW_LOCATION_DATA,
    PERMISSIONS.MANAGE_TRACKING,
    PERMISSIONS.VIEW_HISTORICAL_DATA
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.EDIT_PRODUCTS,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.EDIT_ORDERS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MODERATE_REVIEWS,
    PERMISSIONS.VIEW_LOCATION_DATA
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.CANCEL_ORDERS
  ],
  [ROLES.GUEST]: [
    PERMISSIONS.VIEW_PRODUCTS
  ]
};

// Create RBAC Context
const RBACContext = createContext();

// RBAC Provider Component
export const RBACProvider = ({ children }) => {
  const auth = useContext(AuthContext);
  
  // Add proper null checks to prevent destructuring errors
  if (!auth) {
    // If AuthContext is not available, render children with guest permissions
    const guestValue = {
      userRole: ROLES.GUEST,
      userPermissions: ROLE_PERMISSIONS[ROLES.GUEST],
      loading: false,
      ROLES,
      PERMISSIONS,
      ROLE_PERMISSIONS,
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      hasRole: () => false,
      hasAnyRole: () => false,
      isAdmin: () => false,
      isModerator: () => false,
      getRoleLevel: () => 0,
      canAccess: () => false,
      filterByPermissions: () => [],
      getAvailableActions: () => ({ user: [], product: [], order: [], system: [] })
    };
    
    return (
      <RBACContext.Provider value={guestValue}>
        {children}
      </RBACContext.Provider>
    );
  }
  
  const { user, isAuthenticated = false, loading: authLoading } = auth;
  const [userPermissions, setUserPermissions] = useState([]);
  const [userRole, setUserRole] = useState(ROLES.GUEST);
  const [rbacLoading, setRbacLoading] = useState(true);

  // Update user permissions when user changes
  useEffect(() => {
    if (authLoading) {
      setRbacLoading(true);
      return;
    }

    if (isAuthenticated && user) {
      const role = user.role || ROLES.USER;
      setUserRole(role);
      setUserPermissions(ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.USER]);
    } else {
      setUserRole(ROLES.GUEST);
      setUserPermissions(ROLE_PERMISSIONS[ROLES.GUEST]);
    }
    setRbacLoading(false);
  }, [user, isAuthenticated, authLoading]);
  
  // Check if user has a specific permission
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };
  
  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => userPermissions.includes(permission));
  };
  
  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => userPermissions.includes(permission));
  };
  
  // Check if user has a specific role
  const hasRole = (role) => {
    return userRole === role;
  };
  
  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(userRole);
  };
  
  // Check if user is admin or higher
  const isAdmin = () => {
    return hasAnyRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  };
  
  // Check if user is moderator or higher
  const isModerator = () => {
    return hasAnyRole([ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  };
  
  // Get user's role hierarchy level
  const getRoleLevel = () => {
    const roleLevels = {
      [ROLES.GUEST]: 0,
      [ROLES.USER]: 1,
      [ROLES.MODERATOR]: 2,
      [ROLES.ADMIN]: 3,
      [ROLES.SUPER_ADMIN]: 4
    };
    return roleLevels[userRole] || 0;
  };
  
  // Check if user can access a resource based on minimum role level
  const canAccess = (minRoleLevel) => {
    return getRoleLevel() >= minRoleLevel;
  };
  
  // Filter data based on user permissions
  const filterByPermissions = (data, requiredPermission) => {
    if (!hasPermission(requiredPermission)) {
      return [];
    }
    return data;
  };
  
  // Get available actions for current user
  const getAvailableActions = (context) => {
    const actions = {
      user: [],
      product: [],
      order: [],
      system: []
    };
    
    // User management actions
    if (hasPermission(PERMISSIONS.VIEW_USERS)) actions.user.push('view');
    if (hasPermission(PERMISSIONS.CREATE_USERS)) actions.user.push('create');
    if (hasPermission(PERMISSIONS.EDIT_USERS)) actions.user.push('edit');
    if (hasPermission(PERMISSIONS.DELETE_USERS)) actions.user.push('delete');
    if (hasPermission(PERMISSIONS.MANAGE_USER_ROLES)) actions.user.push('manage_roles');
    
    // Product management actions
    if (hasPermission(PERMISSIONS.VIEW_PRODUCTS)) actions.product.push('view');
    if (hasPermission(PERMISSIONS.CREATE_PRODUCTS)) actions.product.push('create');
    if (hasPermission(PERMISSIONS.EDIT_PRODUCTS)) actions.product.push('edit');
    if (hasPermission(PERMISSIONS.DELETE_PRODUCTS)) actions.product.push('delete');
    if (hasPermission(PERMISSIONS.MANAGE_INVENTORY)) actions.product.push('manage_inventory');
    
    // Order management actions
    if (hasPermission(PERMISSIONS.VIEW_ORDERS)) actions.order.push('view');
    if (hasPermission(PERMISSIONS.VIEW_ALL_ORDERS)) actions.order.push('view_all');
    if (hasPermission(PERMISSIONS.EDIT_ORDERS)) actions.order.push('edit');
    if (hasPermission(PERMISSIONS.CANCEL_ORDERS)) actions.order.push('cancel');
    if (hasPermission(PERMISSIONS.PROCESS_REFUNDS)) actions.order.push('refund');
    
    // System actions
    if (hasPermission(PERMISSIONS.VIEW_ANALYTICS)) actions.system.push('analytics');
    if (hasPermission(PERMISSIONS.MANAGE_SETTINGS)) actions.system.push('settings');
    if (hasPermission(PERMISSIONS.EXPORT_DATA)) actions.system.push('export');
    
    return context ? actions[context] : actions;
  };
  
  const value = {
    // Role and permission data
    userRole,
    userPermissions,
    loading: rbacLoading,
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    
    // Permission checking functions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Role checking functions
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    
    // Access control functions
    getRoleLevel,
    canAccess,
    filterByPermissions,
    getAvailableActions
  };
  
  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};

// Custom hook to use RBAC context
export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

// Higher-order component for permission-based rendering
export const withPermission = (permission) => (Component) => {
  return (props) => {
    const { hasPermission } = useRBAC();
    if (!hasPermission(permission)) {
      return null;
    }
    return <Component {...props} />;
  };
};

// Higher-order component for role-based rendering
export const withRole = (roles) => (Component) => {
  return (props) => {
    const { hasAnyRole } = useRBAC();
    const roleArray = Array.isArray(roles) ? roles : [roles];
    if (!hasAnyRole(roleArray)) {
      return null;
    }
    return <Component {...props} />;
  };
};

export { PERMISSIONS, ROLES };
export default RBACContext;