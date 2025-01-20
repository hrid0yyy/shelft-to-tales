import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useAuth } from "@/hooks/AuthContext";
export default function Tab({ ScreenChanger }) {
  const [activeTab, setActiveTab] = useState("Home"); // Track active tab
  const { user } = useAuth();
  const handlePress = (screenName) => {
    setActiveTab(screenName); // Update active tab
    ScreenChanger(screenName); // Call the ScreenChanger function
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => handlePress("Home")}>
          <AntDesign
            name="home"
            size={hp(3.5)}
            color={activeTab === "Home" ? "white" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Books")}>
          <Feather
            name="book-open"
            size={hp(3.5)}
            color={activeTab === "Books" ? "white" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Cart")}>
          <Octicons
            name="people"
            size={hp(3.5)}
            color={activeTab === "Cart" ? "white" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Profile")}>
          <Image
            style={{
              height: hp(3.5),
              width: wp(3.5),
              aspectRatio: 1,
              borderRadius: 50,
            }}
            source={{
              uri: user.profile_url,
            }}
            // source={require("@/assets/images/mehrin.jpeg")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(88),
    marginStart: hp(5),
  },
  tabContainer: {
    elevation: 5, // Android
    height: hp(8),
    width: wp(80),
    borderRadius: hp(5),
    backgroundColor: "rgba(60, 105, 96, 1)", // 80% opaque

    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
