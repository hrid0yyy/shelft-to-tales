import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  deliverMessage,
  fetchMessages,
  fetchNewMessages,
} from "@/utils/messenger";
import { useAuth } from "@/hooks/AuthContext";
import Loading from "@/components/Loading";

export default function ChatBox() {
  const { receiverId } = useLocalSearchParams();
  const { user } = useAuth();
  const [receiver, setReceiver] = useState();
  const [inbox, setInbox] = useState(null);
  const [lastId, setLastId] = useState();
  const [isSeen, setIsSeen] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    fetchMessagesData();

    const intervalId = setInterval(async () => {
      if (lastId) {
        const newMessages = await fetchNewMessages(
          user?.id,
          receiverId,
          lastId,
          isSeen
        );
        if (newMessages.length > 0) {
          const latestMessageId = newMessages[newMessages.length - 1]?.id;
          setLastId(latestMessageId);
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [lastId, seen]);
  const router = useRouter();

  const fetchMessagesData = async () => {
    try {
      // Assuming fetchMessages is a function that fetches data from an API
      const response = await fetchMessages(user?.id, receiverId);
      setReceiver(response.receiverInfo);
      setInbox(response.messages);
      // Use the correct reference to get the last message id

      const lastMessage = response.messages[0];
      console.log(lastMessage);
      const senderId = lastMessage?.senderId;
      const status = lastMessage?.status;
      const lastMessageId = lastMessage?.id;
      if (status == "seen") {
        setSeen(true);
      } else {
        setSeen(false);
      }
      if (senderId != user?.id) {
        setIsSeen(true);
      }
      console.log("isSeen :", isSeen);
      setLastId(lastMessageId);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp); // Convert ISO string to Date object

    // Define options for custom formatting
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 12-hour format (AM/PM)
      month: "short", // Abbreviated month (e.g., Jan)
      day: "numeric", // Day of the month
      year: "numeric", // Full year (e.g., 2025)
    };

    // Format the date and return the custom string
    const formattedTime = date.toLocaleString("en-US", options);

    // Return in the format "7:20 PM, Jan 20, 2025"
    return formattedTime.replace(",", ",");
  }
  const [message, setMessage] = useState(""); // State to track message input
  const sendMessage = async () => {
    const response = await deliverMessage(user?.id, receiverId, message);

    setMessage("");
  };

  const renderMessages = ({ item }) => {
    const isUser = item.senderId != user?.id;
    return (
      <View
        style={[
          styles.messageWrapper,
          isUser ? { alignItems: "flex-start" } : { alignItems: "flex-end" },
        ]}
      >
        <View
          style={[
            styles.messageContainer,
            isUser ? styles.userMessage : styles.myMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.myMessageText,
            ]}
          >
            {item.message}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formatTimestamp(item.time)} </Text>
      </View>
    );
  };

  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  if (inbox == null) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="arrowleft" size={hp(3)} color="white" />
        </TouchableOpacity>
        <Image
          source={{
            uri: receiver?.profile_url,
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          onPress={() => {
            router.push("/screens/UserProfile");
          }}
        >
          <Text style={styles.profileName}>{receiver?.username}</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={inbox} // Sort in descending order
        renderItem={renderMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        inverted
      />
      {seen && (
        <View style={{ width: wp(100), flexDirection: "row-reverse" }}>
          <Image
            style={{
              height: hp(2.5),
              aspectRatio: 1,
              borderRadius: 100,
              marginRight: wp(4),
              marginTop: -hp(3),
            }}
            resizeMode="contain"
            source={{ uri: receiver?.profile_url }}
          />
        </View>
      )}

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#cfcfcf"
          value={message}
          onChangeText={(e) => setMessage(e)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={hp(2.5)} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(60, 105, 96, 1)",
    padding: wp(4),
  },
  profileImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    marginLeft: wp(2),
  },
  profileName: {
    color: "white",
    fontSize: hp(2.2),
    fontFamily: "OpenSans_700Bold",
    marginLeft: wp(2),
  },
  messageList: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  messageWrapper: {
    marginVertical: hp(1),
  },
  messageContainer: {
    maxWidth: "75%",
    borderRadius: wp(3),
    padding: wp(3),
  },
  userMessage: {
    backgroundColor: "#ffffff",
    borderColor: "rgba(60, 105, 96, 1)",
    borderWidth: 1,
  },
  myMessage: {
    backgroundColor: "rgba(60, 105, 96, 1)",
  },
  messageText: {
    fontSize: hp(2),
    fontFamily: "OpenSans_400Regular",
  },
  userMessageText: {
    color: "black",
  },
  myMessageText: {
    color: "white",
  },
  timestamp: {
    color: "grey",
    fontSize: hp(1.6),
    fontFamily: "OpenSans_400Regular",
    marginBottom: hp(0.5),
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3),
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  input: {
    flex: 1,
    height: hp(),
    backgroundColor: "#f1f1f1",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    fontSize: hp(1.5),
    fontFamily: "OpenSans_400Regular",
    marginRight: wp(2),
  },
  sendButton: {
    backgroundColor: "rgba(60, 105, 96, 1)",
    borderRadius: wp(3),
    width: hp(5),
    height: hp(5),
    justifyContent: "center",
    alignItems: "center",
  },
});
