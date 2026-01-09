import React from 'react';
import { useRBAC } from '../context/RBACContext';

// Component that renders children only if user has required permission
const PermissionGate = ({ permission, permissions, requireAll = false, fallback = null, children }) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();
  let hasAccess = false;

  if (permission) {
    // Single permission check
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    // Multiple permissions check
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions);
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

// Component that renders children only if user has required role
const RoleGate = ({ role, roles, minLevel, fallback = null, children }) => {
  const { hasRole, hasAnyRole, canAccess, ROLES } = useRBAC();
  let hasAccess = false;

  if (role) {
    // Single role check
    hasAccess = hasRole(role);
  } else if (roles) {
    // Multiple roles check
    hasAccess = hasAnyRole(roles);
  } else if (minLevel !== undefined) {
    // Minimum role level check
    const roleLevels = {
      [ROLES.GUEST]: 0,
      [ROLES.USER]: 1,
      [ROLES.MODERATOR]: 2,
      [ROLES.ADMIN]: 3,
      [ROLES.SUPER_ADMIN]: 4
    };
    hasAccess = canAccess(minLevel);
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

// Component that shows different content based on user role
const ConditionalRender = ({ conditions, defaultContent = null }) => {
  const rbac = useRBAC();

  for (const condition of conditions) {
    const { permission, permissions, role, roles, minLevel, content } = condition;
    let shouldRender = false;

    if (permission && rbac.hasPermission(permission)) {
      shouldRender = true;
    } else if (permissions) {
      if (condition.requireAll) {
        shouldRender = rbac.hasAllPermissions(permissions);
      } else {
        shouldRender = rbac.hasAnyPermission(permissions);
      }
    } else if (role && rbac.hasRole(role)) {
      shouldRender = true;
    } else if (roles && rbac.hasAnyRole(roles)) {
      shouldRender = true;
    } else if (minLevel !== undefined && rbac.canAccess(minLevel)) {
      shouldRender = true;
    }

    if (shouldRender) {
      return content;
    }
  }

  return defaultContent;
};

// Component for admin-only content
const AdminOnly = ({ fallback = null, children }) => {
  const { isAdmin } = useRBAC();

  if (!isAdmin()) {
    return fallback;
  }

  return children;
};

// Component for moderator and above content
const ModeratorOnly = ({ fallback = null, children }) => {
  const { isModerator } = useRBAC();

  if (!isModerator()) {
    return fallback;
  }

  return children;
};

// Component that shows user's available actions
const ActionMenu = ({ context, onActionClick, className = '' }) => {
  const { getAvailableActions } = useRBAC();
  const actions = getAvailableActions(context);

  if (!actions || actions.length === 0) {
    return null;
  }

  const actionLabels = {
    view: 'View',
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    manage_roles: 'Manage Roles',
    manage_inventory: 'Manage Inventory',
    view_all: 'View All',
    cancel: 'Cancel',
    refund: 'Process Refund',
    analytics: 'Analytics',
    settings: 'Settings',
    export: 'Export Data'
  };

  return (
    <div className={`action-menu ${className}`}>
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onActionClick(action)}
          className="action-button px-3 py-1 m-1 bg-coral text-white rounded hover:bg-coral-dark"
        >
          {actionLabels[action] || action}
        </button>
      ))}
    </div>
  );
};

// Debug component to show current permissions (development only)
const PermissionDebugger = ({ show = false }) => {
  const { userRole, userPermissions, ROLES, PERMISSIONS } = useRBAC();

  if (!show) {
    return null;
  }

  return (
    <div className="permission-debugger bg-gray-100 p-4 rounded border">
      <h3 className="font-bold mb-2">Permission Debugger</h3>
      <p>
        <strong>Current Role:</strong> {userRole}
      </p>
      <div className="mt-2">
        <strong>Permissions:</strong>
        <ul className="list-disc list-inside">
          {userPermissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export {
  PermissionGate,
  RoleGate,
  ConditionalRender,
  AdminOnly,
  ModeratorOnly,
  ActionMenu,
  PermissionDebugger
};

export default PermissionGate;