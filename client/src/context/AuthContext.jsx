import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('luxe_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      setUser(data);
      localStorage.setItem('luxe_user', JSON.stringify(data));
      localStorage.setItem('luxe_token', data.token);
      return { success: true, user: data };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credentialOrPayload) => {
    setLoading(true);
    try {
      const payload = typeof credentialOrPayload === 'string' 
        ? { credential: credentialOrPayload } 
        : credentialOrPayload;
      const data = await api.googleLogin(payload);
      setUser(data);
      localStorage.setItem('luxe_user', JSON.stringify(data));
      localStorage.setItem('luxe_token', data.token);
      return { success: true, user: data };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.register({ name, email, password });
      setUser(data);
      localStorage.setItem('luxe_user', JSON.stringify(data));
      localStorage.setItem('luxe_token', data.token);
      return { success: true, user: data };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxe_user');
    localStorage.removeItem('luxe_token');
  };

  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, loginWithGoogle, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
