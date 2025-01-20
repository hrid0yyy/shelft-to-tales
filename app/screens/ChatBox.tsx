import React, { useState } from "react";
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
import { useRouter } from "expo-router";

export default function ChatBox({ navigation }) {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! How can I help you?",
      sender: "user",
      time: new Date("2023-12-30T10:00:00"),
    },
    {
      id: "2",
      text: "Can you tell me more about the services?",
      sender: "me",
      time: new Date("2023-12-30T10:01:00"),
    },
    {
      id: "3",
      text: "Sure, let me provide you with the details.",
      sender: "user",
      time: new Date("2023-12-30T10:02:00"),
    },
    {
      id: "4",
      text: "What are the prices for your premium plans?",
      sender: "me",
      time: new Date("2023-12-30T10:05:00"),
    },
    {
      id: "5",
      text: "The premium plan starts at $50 per month.",
      sender: "user",
      time: new Date("2023-12-30T10:06:00"),
    },
    {
      id: "6",
      text: "Is there a trial version available?",
      sender: "me",
      time: new Date("2023-12-30T10:10:00"),
    },
    {
      id: "7",
      text: "Yes, we offer a 14-day trial for all plans.",
      sender: "user",
      time: new Date("2023-12-30T10:12:00"),
    },
  ]);

  const sendMessage = () => {
    if (inputText.trim() !== "") {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: "me",
        time: new Date(),
      };
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setInputText("");
    }
  };

  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";
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
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formatDateTime(item.time)}</Text>
      </View>
    );
  };

  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
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
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS82vYIBVS3uk8dOuC-ZPBCSs6kVfAAAyZGKg&s",
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          onPress={() => {
            router.push("/screens/UserProfile");
          }}
        >
          <Text style={styles.profileName}>Monkey D Luffy</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages.sort((a, b) => b.time - a.time)} // Sort in descending order
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        inverted
      />

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#cfcfcf"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
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
    height: hp(5),
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
