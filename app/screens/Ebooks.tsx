import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";

import { BottomSheet } from "react-native-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
export default function Ebooks() {
  const router = useRouter();
  const bottomSheet = useRef<BottomSheetRef>(null);
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  return (
    <View style={styles.container}>
      <BottomSheet height={600} ref={bottomSheet}>
        <View
          style={{
            width: wp(100),
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: hp(3),
            gap: hp(1),
          }}
        >
          <Image
            style={{ height: hp(20), aspectRatio: 1 }}
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2KZ1NgDCph0JfyIDjOg3oZ7crBnipU6CFBQ&s",
            }}
          />
          <Text style={{ fontSize: hp(4), fontFamily: "OpenSans_400Regular" }}>
            Book Title
          </Text>
          <Text style={{ fontSize: hp(2), fontFamily: "OpenSans_400Regular" }}>
            Book Author
          </Text>
          <Text
            style={{
              fontSize: hp(1.5),
              textAlign: "center",
              fontFamily: "OpenSans_400Regular",
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            illum nesciunt assumenda numquam aut blanditiis recusandae soluta
            necessitatibus, nulla tempora quos inventore nostrum sint maiores
            corrupti ducimus suscipit vel adipisci!
          </Text>

          <Text
            style={{
              fontSize: hp(1.5),
              textAlign: "center",
              fontFamily: "OpenSans_400Regular",
            }}
          >
            Genre: Romance, Novel
          </Text>
          <Text
            style={{
              fontSize: hp(1.5),
              textAlign: "center",
              fontFamily: "OpenSans_400Regular",
            }}
          >
            100 taka
          </Text>

          <TouchableOpacity
            style={{
              height: hp(7),
              width: wp(40),
              backgroundColor: "#3c6960",
              justifyContent: "center",
              borderRadius: hp(3),
              marginTop: hp(3),
            }}
          >
            <Text
              style={{
                fontSize: hp(2),
                textAlign: "center",
                fontFamily: "OpenSans_400Regular",
                color: "white",
              }}
            >
              Purchase
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="arrowleft" size={hp(4)} color="black" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <AntDesign name="search1" size={hp(2.5)} color="black" />
          </View>
          <TextInput style={styles.input} placeholder="Search E Books" />
        </View>
      </View>

      <ScrollView style={styles.mainBox}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: wp(100),
            gap: hp(3),
          }}
        >
          <View style={styles.book}>
            <Image
              style={styles.image}
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2KZ1NgDCph0JfyIDjOg3oZ7crBnipU6CFBQ&s",
              }}
            />
            <View style={styles.details}>
              <Text style={styles.title}>Book Title</Text>
              <Text style={styles.author}>Book Author</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => bottomSheet.current?.show()}
              >
                <Text style={styles.buttonText}>Details | 150</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: hp(100),
  },
  topBar: {
    padding: 10,
    width: wp(100),

    flexDirection: "row",
    justifyContent: "flex-start",
    gap: wp(8),
    alignItems: "center",
  },
  ebooks: {
    fontSize: hp(3.5),
    fontFamily: "OpenSans_400Regular",
  },
  mainBox: {
    height: hp(90),
    width: wp(100),
  },
  searchBar: {
    height: hp(7),
    width: wp(70),
    backgroundColor: "white",
    elevation: 5,
    borderRadius: hp(3),
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    height: hp(5),
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginLeft: hp(1),
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: wp(54),
    marginLeft: hp(1),
  },
  book: {
    height: hp(20),
    width: wp(70),
    flexDirection: "row",
  },
  details: {
    marginLeft: hp(1),
    gap: hp(1),
    marginTop: hp(2),
  },
  title: {
    fontSize: hp(2),
    width: wp(40),
    fontFamily: "OpenSans_400Regular",
  },
  author: {
    fontSize: hp(1.5),
    width: wp(40),
    fontFamily: "OpenSans_400Regular",
    color: "grey",
  },
  button: {
    backgroundColor: "#3c6960",
    height: hp(5),
    width: wp(30),
    justifyContent: "center",
    position: "fixed",
    top: hp(4),
  },
  buttonText: {
    fontSize: hp(1.5),
    color: "white",
    textAlign: "center",
    fontFamily: "OpenSans_400Regular",
  },
  image: {
    height: hp(20),
    aspectRatio: 1,
  },
});
