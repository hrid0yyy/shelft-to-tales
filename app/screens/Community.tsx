import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import PostCard from "@/components/PostCard";
export default function Community() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  const [activeTab, setActiveTab] = useState("Trending"); // State to manage active tab

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tab}>
        <TouchableOpacity
          style={styles.tabOpt}
          onPress={() => handleTabPress("Trending")}
        >
          <Text
            style={{
              fontFamily:
                activeTab === "Trending"
                  ? "OpenSans_700Bold"
                  : "OpenSans_400Regular",
              fontSize: hp(2),
            }}
          >
            Trending
          </Text>
          <View
            style={{
              height: hp(0.8),
              width: wp(10),
              backgroundColor:
                activeTab === "Trending" ? "#3c6960" : "transparent",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabOpt}
          onPress={() => handleTabPress("Following")}
        >
          <Text
            style={{
              fontFamily:
                activeTab === "Following"
                  ? "OpenSans_700Bold"
                  : "OpenSans_400Regular",
              fontSize: hp(2),
            }}
          >
            Following
          </Text>
          <View
            style={{
              height: hp(0.8),
              width: wp(10),
              backgroundColor:
                activeTab === "Following" ? "#3c6960" : "transparent",
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: wp(0.5),
          width: wp(100),
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      />
      <ScrollView style={{ height: hp(80) }}>
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <View style={{ height: hp(10) }}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    width: wp(100),
    height: hp(7),
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  tabOpt: {
    alignItems: "center",
    gap: 5,
  },
});
