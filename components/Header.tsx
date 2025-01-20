import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";
import { useNotification } from "@/hooks/NotificationContext";
export default function Header() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.searchBarContainer}>
          <AntDesign name="search1" size={hp(2)} color="grey" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
          />
        </View>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={() => {
            router.push("/screens/Notification");
          }}
        >
          <AntDesign
            name="message1"
            s
            size={hp(3)}
            style={{ marginRight: wp(8) }}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push("/screens/Cart");
          }}
        >
          <SimpleLineIcons name="handbag" size={hp(3)} color="black" />{" "}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: hp(2),
    height: hp(10),
  },
  searchBarContainer: {
    width: wp(65),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: hp(3),
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",

    // Shadow for Android
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: hp(1.5),
    fontFamily: "OpenSans_400Regular",
  },
  profile: {
    height: hp(7),
    aspectRatio: 1,
    borderRadius: hp(50),
  },
  leftContainer: {
    width: wp(65),
    flexDirection: "row",
    alignItems: "center",

    gap: wp(4),
  },
  rightContainer: {
    width: wp(35),
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: wp(4),
  },
});
