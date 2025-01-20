import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import {
  fetchExchangeBookDetails,
  filterResults,
  sendExchangeRequest,
} from "@/utils/exchange";
import Loading from "@/components/Loading";
import { useAuth } from "@/hooks/AuthContext";
export default function ExchangeBooksDetails() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const router = useRouter();
  const { exchangeId } = useLocalSearchParams();
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const books = ["Harry Potter", "The Hobbit", "1984", "Pride and Prejudice"];
  const [item, setItem] = useState(undefined);
  const [myBooks, setMyBooks] = useState();
  const { user } = useAuth();
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await fetchExchangeBookDetails(exchangeId);
        const filter = await filterResults(user.id, response.prefItem);
        setMyBooks(filter);
        console.log(filter);
        setItem(response); // Set the fetched data in state
      } catch (error) {
        console.error("Error fetching exchange book details:", error.message);
      }
    };

    fetch();
  }, [exchangeId]);

  const send = async () => {
    const { success, error } = await sendExchangeRequest(
      selectedBook,
      exchangeId
    );
    console.log(success);
    if (success) {
      alert("Request sent successfully");
    } else if (error == "Missing parameters") {
      alert("Please select a book");
    } else {
      alert("Already Sent");
    }
  };

  if (!item) {
    // Show a loading indicator while fetching data
    return <Loading />;
  }
  return (
    <View>
      Back Button
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={hp(3.5)} color="black" />
      </TouchableOpacity>
      {/* Image Slider */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
        scrollEventThrottle={16}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
      </ScrollView>
      <ScrollView>
        <View style={styles.profileWrapper}>
          <Text style={styles.bookTitle}>{item.title}</Text>

          <Text style={{ fontFamily: "OpenSans_400Regular" }}>
            Preferred Items
          </Text>
          <Text style={styles.bookGenre}>{item.prefItem}</Text>

          <Text style={{ fontFamily: "OpenSans_400Regular" }}>Description</Text>
          <Text style={styles.bookGenre}>{item.description}</Text>

          <View style={styles.profileBox}>
            <Image
              style={{ width: wp(20) }}
              source={{
                uri: item.users.profile_url,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                router.push("/screens/UserProfile");
              }}
            >
              <View style={{ marginLeft: hp(2), gap: hp(0.5), width: wp(50) }}>
                <Text
                  style={{ fontSize: hp(2), fontFamily: "OpenSans_400Regular" }}
                >
                  {item.users.full_name}
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    fontFamily: "OpenSans_400Regular",
                    color: "grey",
                  }}
                >
                  @{item.users.username}
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    fontFamily: "OpenSans_400Regular",
                    color: "grey",
                  }}
                >
                  {item.users.email}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: hp(15),
            padding: hp(5),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: hp(3),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.push("/screens/ChatBox");
            }}
            style={{
              height: hp(6),
              width: wp(30),
              backgroundColor: "white",
              borderRadius: hp(1),
              borderColor: "rgba(60, 105, 96, 1)",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo name="chat" size={hp(3)} color="rgba(60, 105, 96, 1)" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            style={{
              height: hp(6),
              width: wp(30),
              backgroundColor: "rgba(60, 105, 96, 1)",
              borderRadius: hp(1),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            <Text
              style={{
                fontSize: hp(1.5),
                fontFamily: "OpenSans_400Regular",
                color: "white",
              }}
            >
              Request
            </Text>
          </TouchableOpacity>
          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Select Book</Text>
                {/* Dropdown */}
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedBook}
                    onValueChange={(itemValue) => setSelectedBook(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a book" value="" />
                    {myBooks?.map((book, index) => (
                      <Picker.Item
                        label={book.title}
                        value={book.exchangeId}
                        key={index}
                      />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.selectedBookText}>
                  Selected Book Id: {selectedBook || "None"}
                </Text>
                <View style={{ flexDirection: "row", gap: hp(1) }}>
                  <TouchableOpacity
                    style={{
                      height: hp(5),
                      width: wp(30),
                      backgroundColor: "rgba(0,0,0,0.1)",
                      borderRadius: hp(1),
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: hp(2),
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text
                      style={{
                        fontSize: hp(2),
                        fontFamily: "OpenSans_400Regular",
                      }}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={send}
                  >
                    <Text style={styles.modalCloseButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View style={{ height: hp(50) }}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    width: wp(70),
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: hp(1),
    overflow: "hidden",
    marginBottom: hp(2),
  },
  picker: {
    width: "100%",
    height: hp(8),
  },
  selectedBookText: {
    fontSize: hp(2),
    fontFamily: "OpenSans_400Regular",
    color: "gray",
    marginBottom: hp(2),
    textAlign: "center",
  },
  modalOverlay: {
    height: hp(100),
    width: wp(100),
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: wp(80),
    backgroundColor: "white",
    borderRadius: hp(1.5),
    padding: hp(3),
    alignItems: "center",
    justifyContent: "center",
    elevation: 10, // For shadow effect on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, // For shadow effect on iOS
  },
  modalTitle: {
    fontSize: hp(2.5),
    fontFamily: "OpenSans_700Bold",
    color: "#3c6960",
    marginBottom: hp(2),
    textAlign: "center",
  },
  modalDescription: {
    fontSize: hp(2),
    fontFamily: "OpenSans_400Regular",
    color: "gray",
    textAlign: "center",
    marginBottom: hp(2),
  },
  modalCloseButton: {
    height: hp(5),
    width: wp(30),
    backgroundColor: "rgba(60, 105, 96, 1)",
    borderRadius: hp(1),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
  },
  modalCloseButtonText: {
    fontSize: hp(2),
    fontFamily: "OpenSans_400Regular",
    color: "white",
  },
  backButton: {
    position: "absolute",
    top: hp(3),
    left: wp(3),
    zIndex: 10,
  },
  title: {
    fontSize: hp(3),
    fontFamily: "OpenSans_700Bold",
    textAlign: "center",
    marginVertical: hp(2),
  },
  slider: {
    marginLeft: hp(2.5),
    marginTop: hp(8),
    height: hp(30),
    width: wp(90), // Set slider height to 40% of the screen height
  },
  image: {
    width: wp(90),
    height: hp(30), // Set image height to 40% of the screen height
    resizeMode: "contain",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(2),
  },
  dot: {
    width: hp(1),
    height: hp(1),
    borderRadius: hp(0.75),
    marginHorizontal: wp(0.5),
  },

  profileBox: {
    marginTop: hp(3),
    width: wp(80),
    height: hp(20),
    backgroundColor: "white",
    elevation: 5,
    flexDirection: "row",
    padding: hp(2),
  },
  bookTitle: {
    fontSize: hp(3),
    fontFamily: "OpenSans_700Bold",
  },
  bookAuthor: {
    fontSize: hp(2),
    fontFamily: "OpenSans_400Regular",
    color: "grey",
  },

  profileWrapper: {
    width: wp(100),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
  },
  genreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
    width: wp(80), // Ensure it aligns with the rest of the content
    justifyContent: "center",
    paddingHorizontal: hp(6),
  },
  genreLabel: {
    fontSize: hp(1.8),
    fontFamily: "OpenSans_400Regular",
    color: "black",
  },
  genreWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  bookGenre: {
    width: wp(60),
    textAlign: "center",
    fontSize: hp(1.8),
    fontFamily: "OpenSans_400Regular",
    color: "grey",
  },
});
