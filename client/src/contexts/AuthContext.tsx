import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string; // ✅ Use _id to match MongoDB ObjectId
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
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

 const login = async (email: string, password: string): Promise<boolean> => {
  dispatch({ type: 'SET_LOADING', payload: true });

  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
    const { token, user } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', user._id);

    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return true;
  } catch (error: any) {
    dispatch({ type: 'SET_LOADING', payload: false });

    // 💥 Show backend error message
    if (error.response) {
      console.error('Login failed:', error.response.data.message || error.response.data);
      alert(`Login failed: ${error.response.data.message || 'Check credentials'}`);
    } else if (error.request) {
      console.error('No response from server');
      alert('No response from server. Check if backend is running.');
    } else {
      console.error('Error setting up request:', error.message);
      alert(`Error: ${error.message}`);
    }

    return false;
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
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
