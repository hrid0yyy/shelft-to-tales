import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
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
import { MaterialIcons } from "@expo/vector-icons"; // Vector icon library
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";
import { fetchNotifications } from "@/utils/notification";

const Index = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Abstract Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/library.jpg")} // Replace with your abstract image path
          style={styles.abstractImage}
          resizeMode="cover"
        />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { fontFamily: "OpenSans_700Bold" }]}>
          Read any book or novel from all over the world
        </Text>
        <Text style={[styles.subtitle, { fontFamily: "OpenSans_400Regular" }]}>
          Explore all your interests from any book all over the world
        </Text>
      </View>

      {/* Button Section */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          router.push("/login");
        }}
      >
        <Text style={[styles.buttonText, { fontFamily: "OpenSans_700Bold" }]}>
          Start now
        </Text>
        <View style={styles.arrowContainer}>
          <MaterialIcons name="arrow-forward" size={wp("5%")} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("3%"),
  },
  imageContainer: {
    flex: 0.6, // Increase the size of the image container
    alignItems: "center",
    justifyContent: "center",
  },
  abstractImage: {
    width: wp("90%"), // Make the image larger
    height: hp("40%"),
    borderRadius: wp("5%"), // Optional: rounded corners for the image
  },
  textContainer: {
    flex: 0.2, // Reduce the height for the text container
    alignItems: "flex-start", // Align text to the left
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
  },
  title: {
    fontSize: wp("5.5%"),
    color: "#000000",
    marginBottom: hp("1%"),
  },
  subtitle: {
    fontSize: wp("4%"),
    color: "#6B6B6B",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3c6960", // Light green background
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("5%"),
  },
  buttonText: {
    fontSize: wp("4%"),
    color: "white",
  },
  arrowContainer: {
    marginLeft: wp("2%"),
    backgroundColor: "#000000",
    borderRadius: wp("5%"),
    padding: wp("2%"),
  },
});

export default Index;
