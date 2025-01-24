import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/config";
export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [up, setUp] = useState(false);
  useEffect(() => {
    verifyToken();
  }, [token, up]);

  const getToken = async () => {
    const token = (await AsyncStorage.getItem("authToken")) || "no_token";
    return token;
  };

  const verifyToken = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/v1/user/details/check`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setisAuthenticated(true);
        setUser(data.user);
      } else {
        setisAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      alert("Network error: Please check your connection.");
    }
  };
  // integration remaining
  const signOut = async () => {
    const token = await getToken();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data.success) {
        setisAuthenticated(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("SignOut Error:", error);
    }
  };
  const signup = async (email, password, username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();
      if (data.success) {
        await AsyncStorage.setItem("authToken", data.token);
        setToken(data.token);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Network error: Please check your connection.");
    }
  };

  const signin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        await AsyncStorage.setItem("authToken", data.token);
        setToken(data.token);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Signin Error:", error);
      alert("Network error: Please check your connection.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ signin, isAuthenticated, signOut, user, signup, setUp, up }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
