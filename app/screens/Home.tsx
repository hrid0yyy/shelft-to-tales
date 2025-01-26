import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker"; // Expo Image Picker, if you're using Expo
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import BookCard from "@/components/BookCard";
import Blog from "@/components/Blog";
import { searchBooksFromImage } from "@/utils/image";
import Loading from "@/components/Loading";
import { useRouter } from "expo-router";
import { fetchNewReleases, fetchDiscounts } from "@/utils/home";

export default function Home() {
  const [imageBook, setImageBook] = useState([]);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discountBooks, setDiscountBooks] = useState(null);
  const [newBooks, setNewBooks] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const discountsBooksData = await fetchDiscounts();
      setDiscountBooks(discountsBooksData);

      const newBooksData = await fetchNewReleases();
      setNewBooks(newBooksData);

      setLoading(false);
    })();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "You need to grant permission to access the gallery."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      const response = await searchBooksFromImage(result.assets[0].uri);
      setImageBook(response);
      setLoading(false);
      console.log(response);
      setModalVisible(true);
    }
  };

  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const products = [
    {
      id: "1",
      title: "Essentials Men's Short-Sleeve Crewneck T-Shirt",
      price: "$12.00",
      image: "https://via.placeholder.com/150",
      rating: "4.9",
      reviews: "2356",
    },
    {
      id: "2",
      title: "Essentials Color-Block Hoodie",
      price: "$18.00",
      image: "https://via.placeholder.com/150",
      rating: "4.8",
      reviews: "1984",
    },
  ];
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <ScrollView style={styles.container}>
        <Blog />
        {/* feature section */}
        <View
          style={{
            flexDirection: "row",
            width: wp(90),
            marginLeft: wp(5),
          }}
        >
          <Text style={styles.title}>Top Features</Text>
        </View>
        <View style={styles.featureBox}>
          <TouchableOpacity
            style={styles.feature}
            onPress={() => {
              router.push("/screens/Ebooks");
            }}
          >
            <Image
              style={styles.featureImage}
              source={require("@/assets/images/ebook.png")}
            />
            <Text style={styles.featureText}> Read Ebook!</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.feature} onPress={pickImage}>
            <Image
              style={styles.featureImage}
              source={require("@/assets/images/photo-search.png")}
            />
            <Text style={styles.featureText}> Image Search!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.feature}
            onPress={() => {
              router.push("/screens/ExchangeMap");
            }}
          >
            <Image
              style={styles.featureImage}
              source={require("@/assets/images/borrow.png")}
            />
            <Text style={styles.featureText}>Exchange Book!</Text>
          </TouchableOpacity>
        </View>
        {/* best seller section */}

        <View style={styles.bookView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: wp(90),
            }}
          >
            <Text style={styles.title}>New Releases</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: hp(1.5), color: "#3c6960" }}>
                {" "}
                see more{" "}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* book item */}

            {Array.isArray(newBooks) && newBooks.length > 0 ? (
              newBooks.map((book) => (
                <BookCard
                  key={book.bookId}
                  imageUri={book.cover}
                  category={book.genres}
                  title={book.title}
                  author={book.author}
                  price={book.price}
                  bookId={book.bookId}
                />
              ))
            ) : (
              <Text>No books found</Text>
            )}
          </ScrollView>
        </View>

        {/* New Release section */}

        <View style={styles.bookView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: wp(90),
            }}
          >
            <Text style={styles.title}>Discounts</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: hp(1.5), color: "#3c6960" }}>
                {" "}
                see more{" "}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* book item */}

            {Array.isArray(discountBooks) && discountBooks.length > 0 ? (
              discountBooks.map((book) => (
                <BookCard
                  key={book.bookId}
                  imageUri={book.books.cover}
                  category={book.books.genres}
                  title={book.books.title}
                  author={book.books.author}
                  price={book.books.price}
                  bookId={book.bookId}
                />
              ))
            ) : (
              <Text>No books found</Text>
            )}
          </ScrollView>
        </View>
        <View style={{ height: hp(12) }}></View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Result</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>

            {!imageBook?.success && <Text>No Book found</Text>}

            {/* Mapping over the books array */}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={imageBook?.books} // Ensure this is the correct array name in your component
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/screens/BookDetails?bookId=${item.bookId}`);
                  }}
                  style={styles.book}
                >
                  <Image
                    style={styles.bookCover}
                    source={{
                      uri: item.cover,
                    }}
                  />
                  <View style={styles.details}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                    <Text style={styles.bookAuthor}>{item.author}</Text>
                    <Text style={styles.bookPrice}>{item.price}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.bookId.toString()} // Use bookId as the unique key
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    height: hp(90),
  },
  AdvertiseView: {
    height: hp(25),
    width: wp(100),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: hp(1),
  },
  checkBtn: {
    height: hp(3),
    width: wp(20),

    borderRadius: 10,
    backgroundColor: "#3c6960",
  },
  bookView: {
    height: hp(35),
    width: wp(100),

    padding: wp(5),
  },

  title: {
    fontSize: hp(2),
    marginBottom: hp(2),
    fontFamily: "OpenSans_700Bold",
    color: "#3c6960",
  },
  featureBox: {
    height: hp(12),
    width: wp(70),
    marginLeft: wp(15),

    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  feature: {
    height: hp(12),
    width: wp(20),
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    backgroundColor: "white",
  },

  featureImage: {
    height: hp(5),
    aspectRatio: 1,
  },
  featureText: {
    fontSize: hp(1.3),
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 20,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
  },
  addButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
  },
  book: {
    width: wp(78),
    flexDirection: "row",
    gap: hp(2),
    marginBottom: hp(2),
    borderWidth: 1,
    padding: hp(1),
    borderRadius: hp(1),
  },
  bookCover: {
    height: hp(15),
    aspectRatio: 1,
  },
  details: {
    gap: hp(1),
  },
  bookTitle: {
    fontSize: hp(2),
    width: wp(40),
    fontFamily: "OpenSans_400Regular",
  },
  bookAuthor: {
    fontSize: hp(1.5),
    fontFamily: "OpenSans_400Regular",
  },
  bookPrice: {
    fontSize: hp(1.5),
    fontFamily: "OpenSans_400Regular",
  },
});
