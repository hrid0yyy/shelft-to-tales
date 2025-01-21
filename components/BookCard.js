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
import { useRouter } from "expo-router";

const ProductCard = ({ imageUri, category, title, author, price, bookId }) => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  return (
    <View
      style={{
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
      <TouchableOpacity
        onPress={() => {
          router.push(`/screens/BookDetails?bookId=${bookId}`);
        }}
      >
        <View
          style={{
            height: hp(20),
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
            {category.split(/[\s,]+/)[0]}
          </Text>
          <Text
            style={{
              fontSize: hp(1.2),
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {title}
          </Text>
          <View
            style={{
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
                {author}
              </Text>
            </View>
            <Text
              style={{
                fontSize: hp(1.2),
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
