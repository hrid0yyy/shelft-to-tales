import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { uploadImageToServer } from "@/utils/image";
import {
  addExchangeBook,
  fetchExchangeBooks,
  getExchangeRequests,
  respondToExchangeRequest,
} from "@/utils/exchange";
import { useAuth } from "@/hooks/AuthContext";
import { formatDateTime } from "@/utils/time";
import { OpenSans_400Regular } from "@expo-google-fonts/open-sans";
import Map from "@/components/Map";
export default function ExchangeBooks() {
  const router = useRouter();
  const titleRef = useRef("");
  const locationRef = useRef("");
  const descriptionRef = useRef("");
  const prefRef = useRef("");
  const [activeTab, setActiveTab] = useState("Books"); // Toggle between Books and Requests
  const [eBooks, setEbooks] = useState([]);
  const { user } = useAuth();
  const [add, setAdd] = useState(false);
  const [requests, setRequests] = useState([]);
  const [response, setResponse] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [map, setMap] = useState();
  useEffect(() => {
    (async () => {
      const response = await fetchExchangeBooks(user.id);
      setEbooks(response);
      const data = await getExchangeRequests(user.id);
      setRequests(data);
      console.log(data);
    })();
  }, [add, response]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    location: "",
    description: "",
    preferredItem: "",
    image: null,
  });

  const [image, setImage] = useState(); // Array to store selected images

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
      setImage(result.assets[0].uri); // Add new image to array
    }
  };

  const exchangeResponse = async (sender_eid, receiver_eid, res) => {
    console.log(sender_eid, receiver_eid, res);
    const response = await respondToExchangeRequest(
      sender_eid,
      receiver_eid,
      res
    );
    if (response.success) {
      alert("Responded Successfully");
      setResponse((e) => !e);
    } else {
      alert("Something went wrong");
    }
  };
  const upload = async () => {
    if (
      !image ||
      !titleRef.current ||
      !locationRef.current ||
      !descriptionRef ||
      !prefRef
    ) {
      alert("Upload all the information");
      return;
    }
    const url = await uploadImageToServer(image);
    const response = await addExchangeBook(
      user.id,
      titleRef.current,
      locationRef.current,
      descriptionRef.current,
      prefRef.current,
      url,
      map
    );
    if (response) {
      alert("Successfully uploaded");
      setModalVisible(false);
      setAdd((e) => !e);
    } else {
      alert("Failed");
    }
  };

  const renderBooks = () => (
    <FlatList
      data={eBooks}
      keyExtractor={(item) => item.exchangeId}
      renderItem={({ item }) => (
        <View style={styles.bookItem}>
          <Image source={{ uri: item.image }} style={styles.bookImage} />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookLocation}>Location: {item.location}</Text>
            <Text style={styles.bookDescription}>{item.description}</Text>
            <Text style={styles.bookPreferred}>
              Preferred Item: {item.prefItem}
            </Text>
          </View>
        </View>
      )}
    />
  );

  const renderRequests = () => (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.reqid}
      renderItem={({ item }) => (
        <View style={styles.requestItem}>
          <Text style={styles.requesterName}>{item.sender}</Text>
          <Text style={styles.requestBookTitle}>Book: {item.sender_book}</Text>
          <Text style={styles.requestBookTitle}>
            Request Data: {formatDateTime(item.created_at)}
          </Text>
          <Text style={styles.requestMessage}>
            {item.sender} wants to exchange {item.sender_book} with your{" "}
            {item.receiver_book}{" "}
          </Text>
          <View style={styles.buttonBox}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.push(`/screens/UserProfile?userId=${item.sender_id}`);
              }}
            >
              <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push(
                  `/screens/ExchangeBooksDetails?exchangeId=${item.sender_book_eid}`
                );
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Condition</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                exchangeResponse(
                  item.sender_book_eid,
                  item.receiver_book_eid,
                  "Accepted"
                );
              }}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                exchangeResponse(
                  item.sender_book_eid,
                  item.receiver_book_eid,
                  "Decline"
                );
              }}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );

  if (cancel) {
    return <Map cancelBtn={setCancel} setMap={setMap} />;
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Exchange Books</Text>
      </View>

      {/* Toggle Tabs */}
      <View style={styles.toggleTabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Books" && styles.activeTab]}
          onPress={() => setActiveTab("Books")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Books" && styles.activeTabText,
            ]}
          >
            My Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Requests" && styles.activeTab]}
          onPress={() => setActiveTab("Requests")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Requests" && styles.activeTabText,
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {activeTab === "Books" ? renderBooks() : renderRequests()}
      </View>

      {/* Floating Action Button */}
      {activeTab === "Books" && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="plus" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* Add Book Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add New Book</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => {
                setCancel(true);
              }}
            >
              <Text style={styles.uploadButtonText}>Pick Location</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={(value) => (titleRef.current = value.trim())}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              onChangeText={(value) => (locationRef.current = value.trim())}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              onChangeText={(value) => (descriptionRef.current = value.trim())}
            />
            <TextInput
              style={styles.input}
              placeholder="Preferred Item"
              onChangeText={(value) => (prefRef.current = value.trim())}
            />

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>
                {image ? "Change Image" : "Upload Image"}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={upload}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topBar: {
    height: hp(8),
    backgroundColor: "rgba(60, 105, 96, 1)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  toggleTabs: {
    flexDirection: "row",
    justifyContent: "space-around",

    paddingVertical: hp(1),
    borderRadius: 10,
    margin: wp(4),
  },
  tab: {
    padding: hp(1),
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "rgba(60, 105, 96, 1)",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "white",
  },
  mainContent: {
    flex: 1,
    padding: wp(4),
  },
  bookItem: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: hp(2),
    borderRadius: 8,
    marginBottom: hp(2),
    elevation: 3,
  },
  bookImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: wp(4),
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookLocation: {
    fontSize: 14,
    color: "#555",
  },
  bookDescription: {
    fontSize: 14,
    color: "#777",
  },
  bookPreferred: {
    fontSize: 14,
    color: "#555",
  },
  requestItem: {
    backgroundColor: "#ffffff",
    padding: hp(2),
    borderRadius: 8,
    marginBottom: hp(2),
    elevation: 3,
  },
  requesterName: {
    fontSize: 16,

    fontWeight: "bold",
    color: "rgba(60, 105, 96, 1)",
  },
  requestBookTitle: {
    fontSize: 14,
    color: "#555",
    marginTop: hp(0.5),
  },
  requestMessage: {
    fontSize: 14,
    color: "#777",
    marginTop: hp(0.5),
  },
  floatingButton: {
    position: "absolute",
    bottom: hp(4),
    right: wp(4),
    backgroundColor: "rgba(60, 105, 96, 1)",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: wp(80),
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: hp(3),
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: hp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: wp(3),
    marginBottom: hp(1.5),
  },
  uploadButton: {
    backgroundColor: "rgba(60, 105, 96, 1)",
    borderRadius: 8,
    paddingVertical: hp(1.2),
    marginBottom: hp(2),
  },
  uploadButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ddd",
    borderRadius: 8,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#555",
  },
  addButton: {
    backgroundColor: "rgba(60, 105, 96, 1)",
    borderRadius: 8,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
  },
  buttonBox: {
    width: wp(85),

    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    marginTop: hp(2),
    height: hp(5),
    width: wp(20),
    borderWidth: 1,
    borderColor: "#3c6960",
    borderRadius: hp(1),
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: hp(1.5),
    fontFamily: "OpenSans_400Regular",
  },
});
