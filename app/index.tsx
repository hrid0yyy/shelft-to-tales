import React, { useEffect, useState } from "react";
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
  OpenSans_300Light_Italic,
  OpenSans_400Regular_Italic,
} from "@expo-google-fonts/open-sans";
import { MaterialIcons } from "@expo/vector-icons"; // Vector icon library
import { useRouter } from "expo-router";

import { API_BASE_URL } from "../config";
const Index = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light_Italic,
    OpenSans_400Regular_Italic,
  });
  const [data, setData] = useState();
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`${API_BASE_URL}/stats`); // Replace with your server's URL if different
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // You can return the data if needed for further processing
        setData(data);
        return;
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        return null;
      }
    }

    // Example usage
    fetchStats();
  }, []);

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
        <Image
          source={require("@/assets/images/logo.png")} // Replace with your abstract image path
          style={styles.abstractLogo}
          resizeMode="contain"
        />
        <View style={styles.statContainer}>
          <View style={styles.stat}>
            <Text style={styles.statText}>
              Active users: {data?.totalUsers},
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>Books: {data?.totalBooks},</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>E Books: {data?.totalEbooks}</Text>
          </View>
        </View>
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
    flex: 0.45, // Increase the size of the image container
    alignItems: "center",
    justifyContent: "center",
  },
  abstractImage: {
    width: wp("90%"), // Make the image larger
    height: hp("40%"),
    borderRadius: wp("5%"), // Optional: rounded corners for the image
  },
  abstractLogo: {
    width: wp(25),
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
  statContainer: {
    height: hp(6),
    width: wp(80),
    flexDirection: "row",
    gap: wp(2),

    alignItems: "center",
  },
  stat: {
    height: hp(7),

    justifyContent: "center",
    alignItems: "center",
  },
  statText: {
    color: "#3c6960",
    fontSize: hp(1.5),
    fontFamily: "OpenSans_300Light_Italic",
  },
});

export default Index;
