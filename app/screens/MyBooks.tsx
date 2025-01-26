import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  OpenSans_400Regular,
  useFonts,
  OpenSans_700Bold,
  OpenSans_300Light_Italic,
} from "@expo-google-fonts/open-sans";
import Feather from "@expo/vector-icons/Feather";

import { ProgressBar, MD3Colors } from "react-native-paper";
import { useRouter } from "expo-router";
import { getEbooks } from "@/utils/ebook";
import { useAuth } from "@/hooks/AuthContext";
import Loading from "@/components/Loading";
import { getWishlist } from "@/utils/book";
export default function MyEbooks() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [ebooks, setEbooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(null);
  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await getEbooks(user?.id, search);
        setEbooks(response);
        const wish = await getWishlist(user?.id, search);
        setWishlist(wish);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Set an interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchEbooks, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [search, user?.id]); // Include dependencies if needed

  const router = useRouter();

  const [activeOption, setActiveOption] = useState("E Books");
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light_Italic,
  });

  const renderContent = () => {
    if (activeOption === "E Books") {
      return (
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {ebooks?.map((book) => (
              <View key={book.bookId} style={{ alignItems: "center" }}>
                <View style={styles.bookContent}>
                  <Image
                    style={styles.bookCover}
                    source={{
                      uri: book.books.cover,
                    }}
                    resizeMode="contain"
                  />
                  <Text style={styles.bookTitle}>{book.books.title}</Text>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      console.log(book.pageAt);
                      router.push(
                        `/screens/EbookReader?bookId=${book.bookId}&url=${book.eBooks.url}&pageAt=${book.pageAt}&title=${book.books.title}`
                      );
                    }}
                  >
                    <Feather name="book-open" size={hp(4)} color="white" />
                  </TouchableOpacity>
                </View>
                {true && (
                  <View style={{ width: wp(60), marginBottom: hp(2) }}>
                    <ProgressBar
                      progress={book.pageAt / book.books.page}
                      color="#3c6960"
                    />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      );
    } else if (activeOption === "Wish list") {
      return (
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              {wishlist.map((book) => (
                <View key={book.bookId} style={{ alignItems: "center" }}>
                  <View style={styles.bookContent}>
                    <Image
                      style={styles.bookCover}
                      source={{
                        uri: book.books.cover,
                      }}
                      resizeMode="contain"
                    />
                    <Text style={styles.bookTitle}>{book.books.title}</Text>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        router.push(
                          `/screens/BookDetails?bookId=${book.bookId}`
                        );
                      }}
                    >
                      <Feather name="book-open" size={hp(4)} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </ScrollView>
        </View>
      );
    }
    return null; // Fallback for unknown options
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <AntDesign name="search1" size={hp(2.5)} color="black" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Search Books"
            onChangeText={(e) => setSearch(e)}
          />
        </View>
      </View>
      <View style={{ width: wp(100), alignItems: "center" }}>
        <Text
          style={{
            fontSize: hp(3),
            fontFamily: "OpenSans_700Bold",
            color: "#3c6960",
          }}
        >
          Book Shelf
        </Text>
      </View>
      <View style={styles.toggleMenu}>
        {["E Books", "Wish list"].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setActiveOption(option)}
            style={[
              styles.toggleButton,
              activeOption === option && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                activeOption === option && styles.activeText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Render content based on active option */}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    padding: 10,
    width: wp(100),
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp(1),
    alignItems: "center",
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
  toggleMenu: {
    width: wp(100),
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: hp(1),
  },
  toggleButton: {
    paddingBottom: hp(0.5),
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeButton: {
    borderBottomColor: "#3c6960",
  },
  toggleText: {
    fontSize: hp(2),
    fontFamily: "OpenSans_400Regular",
    color: "#3c6960",
  },
  activeText: {
    fontFamily: "OpenSans_700Bold",
  },
  content: {
    marginTop: hp(2),
    alignItems: "center",
    height: hp(80),
    width: wp(100),
  },
  contentText: {
    fontSize: hp(2.5),
    fontFamily: "OpenSans_400Regular",
    color: "#3c6960",
  },
  bookContent: {
    height: hp(15),
    width: wp(80),
    backgroundColor: "white",
    borderRadius: hp(5),
    marginBottom: hp(2),
    flexDirection: "row",
    alignItems: "center",
  },
  bookCover: {
    height: hp(15),
    aspectRatio: 1,
    borderRadius: hp(5),
    overflow: "hidden", // Ensures the image stays within the bounds of the borderRadius
  },
  bookTitle: {
    fontSize: hp(1.5),
    fontFamily: "OpenSans_300Light_Italic",
    width: wp(30),
  },
  button: {
    marginLeft: hp(1),
    height: hp(8),
    aspectRatio: 1,
    backgroundColor: "#3c6960",
    borderRadius: hp(3),
    justifyContent: "center",
    alignItems: "center",
  },
});
