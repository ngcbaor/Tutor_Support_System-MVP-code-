// Advanced Web Programming - Sample Project
// Modern React Component with Hooks and Performance Optimization

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * UserDashboard - A performance-optimized dashboard component
 * Demonstrates: Hooks, memoization, lazy loading, and best practices
 */
const UserDashboard = ({ userId, initialData = [] }) => {
  // State management
  const [users, setUsers] = useState(initialData);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from API with cleanup
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (mounted) {
          setUsers(data);
        }
      } catch (err) {
        if (mounted && err.name !== 'AbortError') {
          setError(err.message);
          console.error('Failed to fetch users:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    // Cleanup function
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [userId]);

  // Memoized filtered users - prevents unnecessary recalculation
  const filteredUsers = useMemo(() => {
    if (!filter) return users;
    
    const lowerFilter = filter.toLowerCase();
    return users.filter(user => 
      user.name?.toLowerCase().includes(lowerFilter) ||
      user.email?.toLowerCase().includes(lowerFilter)
    );
  }, [users, filter]);

  // Memoized callbacks - prevents child re-renders
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const handleUserDelete = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete user');
    }
  }, []);

  // Statistics calculation
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.active).length,
    inactive: users.filter(u => !u.active).length,
    filtered: filteredUsers.length
  }), [users, filteredUsers]);

  // Render loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" aria-label="Loading users..."></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="dashboard-error" role="alert">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="stats-bar">
          <StatCard label="Total Users" value={stats.total} />
          <StatCard label="Active" value={stats.active} color="green" />
          <StatCard label="Inactive" value={stats.inactive} color="gray" />
        </div>
      </header>

      {/* Filter Section */}
      <div className="filter-section">
        <input
          type="search"
          placeholder="Search users by name or email..."
          value={filter}
          onChange={handleFilterChange}
          className="search-input"
          aria-label="Search users"
        />
        <span className="result-count">
          Showing {stats.filtered} of {stats.total} users
        </span>
      </div>

      {/* User List */}
      <div className="user-list">
        {filteredUsers.length === 0 ? (
          <EmptyState message="No users found" />
        ) : (
          filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={handleUserDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Memoized child component to prevent unnecessary re-renders
const StatCard = React.memo(({ label, value, color = 'blue' }) => (
  <div className={`stat-card stat-card--${color}`}>
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
));

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'gray', 'red'])
};

// User card component with optimization
const UserCard = React.memo(({ user, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete user ${user.name}?`)) return;
    
    setIsDeleting(true);
    await onDelete(user.id);
    setIsDeleting(false);
  };

  return (
    <div className={`user-card ${user.active ? 'active' : 'inactive'}`}>
      <div className="user-avatar">
        <img 
          src={user.avatar || '/default-avatar.png'} 
          alt={`${user.name}'s avatar`}
          loading="lazy"
        />
      </div>
      <div className="user-info">
        <h3>{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <span className={`user-status ${user.active ? 'status-active' : 'status-inactive'}`}>
          {user.active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="user-actions">
        <button 
          className="btn-delete" 
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete ${user.name}`}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
});

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    active: PropTypes.bool
  }).isRequired,
  onDelete: PropTypes.func.isRequired
};

// Empty state component
const EmptyState = ({ message }) => (
  <div className="empty-state">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" stroke="#ccc" strokeWidth="2"/>
      <path d="M20 32h24M32 20v24" stroke="#ccc" strokeWidth="2"/>
    </svg>
    <p>{message}</p>
  </div>
);

EmptyState.propTypes = {
  message: PropTypes.string.isRequired
};

UserDashboard.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialData: PropTypes.array
};

export default UserDashboard;

// Example usage:
// import UserDashboard from './UserDashboard';
// 
// function App() {
//   return <UserDashboard userId={123} />;
// }
