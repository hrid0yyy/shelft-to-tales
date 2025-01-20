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
export default function ProfileBookCard() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  return (
    <View style={styles.book}>
      <Image
        style={styles.bookCover}
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfg2xjfZwMO84uJlh-LQ-IzG2eIurszQCdQg&s",
        }}
      />
      <View style={styles.text}>
        <TouchableOpacity>
          {" "}
          <Text style={styles.bookTitle}>A pocket full of rye</Text>
        </TouchableOpacity>
        <Text style={styles.bookAuthor}>Agatha Christie</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  book: {
    width: wp(75),
    marginTop: hp(2),
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 5,
    paddingVertical: hp(1),
    paddingLeft: hp(1),
    borderRadius: hp(2),
    marginLeft: hp(1),
  },
  bookTitle: {
    fontSize: hp(2.3),
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
