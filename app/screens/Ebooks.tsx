import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { BottomSheet } from "react-native-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { fetchEbooks, grantAccess } from "@/utils/ebook";
import Loading from "@/components/Loading";
import { useAuth } from "@/hooks/AuthContext";
export default function Ebooks() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [ebooks, setEbooks] = useState(null);

  const { user } = useAuth();
  function truncateText(text, maxLength = 50) {
    if (text?.length <= maxLength) {
      return text; // Return the original text if it's within the limit
    }
    return text?.slice(0, maxLength) + "..."; // Truncate and add ellipsis
  }

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchEbooks(search, sort);
      setEbooks(response?.ebooks);
    };
    fetch();
  }, [search, sort]);
  const router = useRouter();
  const bottomSheet = useRef<BottomSheetRef>(null);
  const [details, setDetails] = useState();

  const handleClaim = async () => {
    const response = await grantAccess(user?.id, details?.bookId);
    if (response.success) {
      showMessage({
        message: "Shelf to tales",
        description: "Thanks for claiming this product",
        type: "success",
      });
    } else {
      showMessage({
        message: "Shelf to tales",
        description: "Something went wrong",
        type: "danger",
      });
    }
  };

  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  if (ebooks == null) {
    return <Loading />;
  }
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
              uri: details?.cover,
            }}
          />
          <Text style={{ fontSize: hp(4), fontFamily: "OpenSans_400Regular" }}>
            {details?.title}
          </Text>
          <Text style={{ fontSize: hp(2), fontFamily: "OpenSans_400Regular" }}>
            {details?.author}
          </Text>
          <Text
            style={{
              fontSize: hp(1.5),
              textAlign: "center",
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {truncateText(details?.description, 250) || ""}
          </Text>

          <Text
            style={{
              fontSize: hp(1.5),
              textAlign: "center",
              fontFamily: "OpenSans_400Regular",
            }}
          >
            Genre: {details?.genres}
          </Text>
          <Text
            style={{
              fontSize: hp(1.5),
              textAlign: "center",
              fontFamily: "OpenSans_400Regular",
            }}
          >
            {details?.price > 0 ? `৳ ${details?.price}` : "Free"}
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
            onPress={() => {
              if (details?.price > 0) {
                // payment process
              } else {
                // claim process
                handleClaim();
                bottomSheet.current?.hide();
              }
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
              {details?.price > 0 ? "Purchase" : "Claim"}
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
          <TextInput
            style={styles.input}
            placeholder="Search E Books"
            onChangeText={(e) => setSearch(e)}
          />
        </View>
        <Menu>
          <MenuTrigger>
            <Ionicons name="filter-sharp" size={hp(3)} color="black" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => setSort("asc")}>
              <Text
                style={{
                  fontFamily: "OpenSans_400Regular",
                  fontSize: hp(1.5),
                }}
              >
                Low to High
              </Text>
            </MenuOption>
            <MenuOption onSelect={() => setSort("desc")}>
              <Text
                style={{
                  fontFamily: "OpenSans_400Regular",
                  fontSize: hp(1.5),
                }}
              >
                High to Low
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
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
          {ebooks.map((book) => (
            <View key={book.bookId} style={styles.book}>
              <Image
                style={styles.image}
                source={{
                  uri: book.cover,
                }}
              />
              <View style={styles.details}>
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.author}>{book.author}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setDetails(book);
                    bottomSheet.current?.show();
                  }}
                >
                  <Text style={styles.buttonText}>
                    Details | {book.price > 0 ? `৳ ${book.price}` : "Free"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          router.push("/screens/MyBooks");
        }}
        style={{
          height: hp(7),
          aspectRatio: 1,
          borderRadius: 100,
          backgroundColor: "#3c6960",
          position: "absolute",
          top: hp(88),
          left: wp(80),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AntDesign name="book" size={hp(3.5)} color="white" />
      </TouchableOpacity>
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
    justifyContent: "space-evenly",
    marginBottom: hp(2),
    marginTop: hp(1),
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
    width: hp(20),
    aspectRatio: 1,
  },
});
