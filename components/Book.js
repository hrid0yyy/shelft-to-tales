import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";

import { fetchBooks } from "@/utils/book";
import { useRouter } from "expo-router";
import { fetchSearchResults } from "@/utils/exchange";
import { useAuth } from "@/hooks/AuthContext";

export default function Book({ type, genre, sort }) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [eBooks, setEBooks] = useState();
  const { user } = useAuth();
  useEffect(() => {
    const getBooks = async () => {
      try {
        // Call fetchBooks without any parameters
        const genreValue = genre === "All" ? null : genre;
        const data = await fetchBooks(sort, genreValue);
        const data2 = await fetchSearchResults(user.id, genreValue);
        setBooks(data);
        setEBooks(data2);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      }
    };

    getBooks();
  }, [sort, genre]);

  function truncateDescription(description, limit = 80) {
    if (description.length > limit) {
      return description.substring(0, limit) + "...";
    }
    return description;
  }
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const router = useRouter();

  const renderContent = () => {
    if (type == "Purchase" || type == "Borrow") {
      return (
        <>
          {books.map((book) => (
            <View style={styles.book} key={book.id}>
              <Image
                style={{
                  height: hp(19),
                  width: wp(25),
                  borderRadius: hp(1),
                }}
                source={{
                  uri: book.cover,
                }}
              />
              <View style={{ width: wp(35), marginLeft: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/screens/BookDetails?bookId=${book.bookId}`);
                  }}
                >
                  <Text
                    style={{
                      fontSize: hp(1.5),
                      fontFamily: "OpenSans_400Regular",
                      fontWeight: "bold",
                      color: "rgba(60, 105, 96, 1)",
                    }}
                  >
                    {book.title}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    marginTop: hp(1),
                    fontSize: hp(1),
                    color: "grey",
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  {book.author}
                </Text>
                <Text
                  style={{
                    marginTop: hp(1),
                    fontSize: hp(1),
                    color: "grey",
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  {truncateDescription(book.description)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    position: "absolute",
                    height: hp(7),
                    width: wp(30),
                    marginTop: hp(12),
                  }}
                >
                  <Text
                    style={{
                      fontSize: hp(1.5),
                      color: "grey",
                      fontFamily: "OpenSans_400Regular",
                    }}
                  >
                    {" "}
                    {book.price} ৳
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      );
    } else {
      return (
        <>
          {eBooks.map((book) => (
            <View style={styles.book} key={book.exchangeId}>
              <Image
                style={{
                  width: wp(25),
                  borderRadius: hp(1),
                }}
                source={{
                  uri: book.image,
                }}
              />
              <View style={{ width: wp(35), marginLeft: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    router.push(
                      `/screens/ExchangeBooksDetails?exchangeId=${book.exchangeId}`
                    );
                  }}
                >
                  <Text
                    style={{
                      fontSize: hp(1.5),
                      fontFamily: "OpenSans_400Regular",
                      fontWeight: "bold",
                      color: "rgba(60, 105, 96, 1)",
                    }}
                  >
                    {book.title}
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{
                    marginTop: hp(1),
                    fontSize: hp(1),
                    color: "grey",
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  {book.location}
                </Text>
                <Text
                  style={{
                    marginTop: hp(1),
                    fontSize: hp(1),
                    color: "grey",
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  In exchange of {book.prefItem}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: hp(1),
                    alignItems: "flex-end",
                    gap: hp(1),
                  }}
                >
                  <Image
                    style={{ height: hp(3), aspectRatio: 1, borderRadius: 50 }}
                    source={{
                      uri: book.users.profileUrl,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: hp(1),
                      color: "grey",
                      fontFamily: "OpenSans_400Regular",
                    }}
                  >
                    {book.users.full_name}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      );
    }
  };

  return <>{renderContent()}</>;
}

const styles = StyleSheet.create({
  book: {
    width: wp(55),
    flexDirection: "row",
  },
});
