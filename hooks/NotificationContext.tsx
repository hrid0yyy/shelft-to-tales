import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "@/config";
import { useAuth } from "./AuthContext";
import { getExchangeRequests } from "@/utils/exchange";
import { allNotifications } from "@/utils/notification";
import { fetchInbox } from "@/utils/messenger";

export const NotificationContext = createContext(null);

export const NotificationContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [totalNotification, setTotalNotification] = useState();
  const [requests, setRequests] = useState(null);
  const [totalRequests, setTotalRequests] = useState();
  const [messages, setMessages] = useState();
  // Create a thread-like effect using a polling interval
  useEffect(() => {
    if (user?.id) {
      // Initial fetch to get notifications
      fetchNotifications();
      // Poll for updates every 10 seconds
      const interval = setInterval(fetchNotifications, 10000);

      // Cleanup the interval when the component unmounts
      return () => clearInterval(interval);
    }
  }, [user?.id]); // Only run this when user ID is available
  async function fetchNotifications() {
    try {
      const reqData = await getExchangeRequests(user.id);
      setRequests(reqData);
      setTotalRequests(reqData.length);

      const notificationData = await allNotifications(user.id);
      setTotalNotification(notificationData.totalUnseen);
      setNotification(notificationData.data);

      const messagesData = await fetchInbox(user?.id);
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { success: false, error: error.message };
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        totalNotification,
        notification,
        totalRequests,
        requests,
        messages,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within an NotificationContextProvider"
    );
  }
  return context;
};
