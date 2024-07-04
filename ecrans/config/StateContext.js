import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };

    loadUserData();
  }, []);

  const saveUserData = async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user data', error);
    }
  };

  const removeUserData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Failed to remove user data', error);
    }
  };
  
  const handleSetUser = (user) => {
    setUser(user);
    saveUserData(user);
  };

  const handleLogout = async () => {
    await removeUserData();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, logout: handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
