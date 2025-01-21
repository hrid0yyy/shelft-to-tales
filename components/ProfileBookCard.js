import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
export default function ProfileBookCard({ cover, title, author }) {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  return (
    <View style={styles.book}>
      <Image
        style={styles.bookCover}
        source={{
          uri: cover,
        }}
      />
      <View style={styles.text}>
        <Text style={styles.bookTitle}>{title}</Text>

        <Text style={styles.bookAuthor}>{author}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  book: {
    marginTop: hp(2),
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 5,
    paddingVertical: hp(1),
    paddingLeft: hp(1),
    borderRadius: hp(2),
    paddingRight: hp(1),
    marginLeft: hp(1),
  },
  bookTitle: {
    fontSize: hp(2.1),
    fontFamily: "OpenSans_400Regular",
    marginRight: hp(1),
  },
  bookAuthor: {
    fontSize: hp(1.5),
    marginRight: hp(1),
    fontFamily: "OpenSans_400Regular",
    color: "grey",
    marginTop: hp(1),
  },
  bookCover: {
    width: wp(20),
    borderRadius: hp(1),
  },
  text: {
    justifyContent: "space-between",
    paddingHorizontal: hp(3),
    width: wp(65),
  },
});
