import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  department: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  availableUsers: User[];
}

type AuthAction =
  | { type: 'SWITCH_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AVAILABLE_USERS'; payload: User[] };

const demoUsers: User[] = [
  {
    _id: 'admin-user',
    name: 'Admin User',
    email: 'admin@greyhr.com',
    role: 'admin',
    department: 'Administration'
  },
  {
    _id: 'hr-user',
    name: 'HR Manager',
    email: 'hr@greyhr.com',
    role: 'hr',
    department: 'Human Resources'
  },
  {
    _id: 'employee-user',
    name: 'John Employee',
    email: 'employee@greyhr.com',
    role: 'employee',
    department: 'Engineering'
  },
  {
    _id: 'jane-user',
    name: 'Jane Smith',
    email: 'jane.smith@greyhr.com',
    role: 'employee',
    department: 'Marketing'
  },
  {
    _id: 'mike-user',
    name: 'Mike Johnson',
    email: 'mike.johnson@greyhr.com',
    role: 'employee',
    department: 'Sales'
  }
];

const initialState: AuthState = {
  user: demoUsers[0], // Start with admin user
  isAuthenticated: true, // Always authenticated
  loading: false,
  availableUsers: demoUsers
};

const AuthContext = createContext<{
  state: AuthState;
  switchUser: (user: User) => Promise<void>;
  logout: () => void;
  loadAvailableUsers: () => Promise<void>;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SWITCH_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_AVAILABLE_USERS':
      return {
        ...state,
        availableUsers: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadAvailableUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/users');
      if (response.data.success) {
        dispatch({ type: 'SET_AVAILABLE_USERS', payload: response.data.users });
      }
    } catch (error) {
      console.error('Failed to load available users:', error);
      // Fallback to demo users if backend is not available
      dispatch({ type: 'SET_AVAILABLE_USERS', payload: demoUsers });
    }
  };

  const switchUser = async (user: User) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Fetch user data from backend
      const response = await axios.get(`http://localhost:3000/api/auth/user/${user._id}`);
      if (response.data.success) {
        const backendUser = response.data.user;
        dispatch({ type: 'SWITCH_USER', payload: backendUser });
        localStorage.setItem('currentUser', JSON.stringify(backendUser));
      } else {
        // Fallback to frontend user data
        dispatch({ type: 'SWITCH_USER', payload: user });
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Failed to fetch user data from backend:', error);
      // Fallback to frontend user data
      dispatch({ type: 'SWITCH_USER', payload: user });
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  };

  const logout = () => {
    // Reset to admin user instead of logging out
    const adminUser = demoUsers.find(u => u.role === 'admin') || demoUsers[0];
    dispatch({ type: 'SWITCH_USER', payload: adminUser });
    localStorage.setItem('currentUser', JSON.stringify(adminUser));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user: User = JSON.parse(savedUser);
        dispatch({ type: 'SWITCH_USER', payload: user });
      } catch (error) {
        // If parsing fails, use admin user
        const adminUser = demoUsers.find(u => u.role === 'admin') || demoUsers[0];
        dispatch({ type: 'SWITCH_USER', payload: adminUser });
      }
    }
    
    // Load available users from backend
    loadAvailableUsers();
  }, []);

  return (
    <AuthContext.Provider value={{ state, switchUser, logout, loadAvailableUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
