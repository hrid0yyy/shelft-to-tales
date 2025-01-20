import { View, ActivityIndicator } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export default function Loading() {
  return (
    <View
      style={{
        height: hp(100),
        width: wp(100),
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
