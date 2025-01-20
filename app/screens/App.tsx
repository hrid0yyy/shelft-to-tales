import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Tab from "@/components/Tab";
import Books from "./Books";
import Community from "./Community";
import Profile from "./Profile";
import Home from "./Home";
import Header from "@/components/Header";
import { fetchNotifications } from "@/utils/notification";
import { useAuth } from "@/hooks/AuthContext";
export default function App() {
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    const loadNotification = async () => {
      const response = await fetchNotifications(user.id);
      setNotification(response.data);
      console.log(response.data);
    };
    // setInterval(loadNotification, 1000);
  }, []);

  const [screen, setScreen] = useState("Home");
  if (screen == "Home") {
    return (
      <View>
        <Header />
        <Home />
        <Tab ScreenChanger={setScreen} />
      </View>
    );
  }
  if (screen == "Books") {
    return (
      <View>
        <Header />
        <Books />
        <Tab ScreenChanger={setScreen} />
      </View>
    );
  }
  if (screen == "Cart") {
    return (
      <View>
        <Header />
        <Community />
        <Tab ScreenChanger={setScreen} />
      </View>
    );
  }
  if (screen == "Profile") {
    return (
      <View>
        <Profile />
        <Tab ScreenChanger={setScreen} />
      </View>
    );
  }
}
