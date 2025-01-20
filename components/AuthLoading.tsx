import React from "react";
import { StyleSheet, View, Image } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function AuthLoading() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image style={styles.logo} source={require("@/assets/images/logo.png")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFAE8",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: hp(40),
    width: wp(60),
  },
});
