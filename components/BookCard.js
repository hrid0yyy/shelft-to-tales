import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Ensure you're using Expo for AntDesign
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";

const ProductCard = ({ imageUri, category, title, rating, reviews, price }) => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  return (
    <View
      style={{
        height: hp(25),
        width: wp(43),
        backgroundColor: "white",
        marginRight: wp(4),
        elevation: 5,
      }}
    >
      <Image
        style={{ height: hp(15), width: wp(43), resizeMode: "cover" }}
        source={{
          uri: imageUri,
        }}
      />
      <TouchableOpacity>
        <View
          style={{
            height: hp(10),
            width: wp(43),
            padding: 4,
          }}
        >
          <Text
            style={{
              fontSize: hp(1),
              color: "grey",
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {category}
          </Text>
          <Text
            style={{
              fontSize: hp(1.5),
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {title}
          </Text>
          <View
            style={{
              height: hp(4),
              flexDirection: "row",
              padding: 3,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", gap: 2 }}>
              <AntDesign name="star" size={hp(2)} color="gold" />
              <Text
                style={{
                  fontSize: hp(1),
                  color: "grey",
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                {rating} | {reviews}
              </Text>
            </View>
            <Text
              style={{
                fontSize: hp(1.5),
                color: "#3c6960",
                fontFamily: "OpenSans_400Regular",
              }}
            >
              ৳ {price}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard;
