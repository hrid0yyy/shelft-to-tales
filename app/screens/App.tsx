import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Tab from "@/components/Tab";
import Books from "./Books";
import Community from "./Community";
import Profile from "./Profile";
import Home from "./Home";

import Header from "@/components/Header";

import { useAuth } from "@/hooks/AuthContext";
export default function App() {
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
