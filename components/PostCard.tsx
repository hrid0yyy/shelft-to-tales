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
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
export default function PostCard({
  userId,
  username,
  content,
  time,
  profileUrl,
}) {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  const router = useRouter();
  return (
    <View style={styles.postCard}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profilePic}
          source={{
            uri: profileUrl,
          }}
        />
      </View>
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <TouchableOpacity
            onPress={() => {
              router.push(`/screens/UserProfile?userId=${userId}`);
            }}
          >
            {" "}
            <Text style={styles.userName}>{username}</Text>
          </TouchableOpacity>

          <Text style={styles.postDate}>{time}</Text>
        </View>

        <Text style={styles.postData}>{content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postCard: {
    width: wp(100),
    flexDirection: "row",
    paddingBottom: hp(2),
    borderBottomWidth: wp(0.5), // Solid line between posts
    borderBottomColor: "rgba(0,0,0,0.2)", // Line color
  },
  profileContainer: {
    width: wp(18),
    padding: 10,
    alignItems: "center",
  },
  profilePic: {
    height: hp(6),
    borderRadius: 50,
    aspectRatio: 1,
  },
  postContent: {
    width: wp(82),
  },
  postHeader: {
    height: hp(5),
    width: wp(82),

    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontFamily: "OpenSans_700Bold",
    fontSize: hp(1.5),
  },
  postDate: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(1),
    color: "grey",
    marginRight: hp(2),
  },
  postData: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(1.3),
  },
});
