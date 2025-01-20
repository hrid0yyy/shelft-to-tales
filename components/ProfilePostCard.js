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

export default function PostCard() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  return (
    <View style={styles.postCard}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profilePic}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvYAGFO9U3lykvVLbSZkijiIxT2uRKHxhy6A&s",
          }}
        />
      </View>
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.userName}>Max Verstappen</Text>

          <Text style={styles.postDate}>28 January, 2025</Text>
        </View>

        <Text style={styles.postData}>
          TU TU TU MAX VERSTAPPEN SIMPLY LOVELY TU TU TU MAX VERSTAPPEN SIMPLY
          LOVELY TU TU TU MAX VERSTAPPEN SIMPLY LOVELY TU TU TU MAX VERSTAPPEN
          SIMPLE LOVELY TU TU TU MAX VERSTAPPEN SIMPLY LOVELY TU TU TU MAX
          VERSTAPPEN SIMPLY LOVELY TU TU TU MAX VERSTAPPEN SIMPLY LOVELY TU TU
        </Text>

        <View style={styles.postFooter}>
          <TouchableOpacity>
            <AntDesign name="hearto" size={hp(2.3)} color="grey" />
          </TouchableOpacity>
          <Text style={styles.reactionNum}>4.2 K</Text>
          <TouchableOpacity>
            <EvilIcons name="comment" size={hp(2.8)} color="grey" />
          </TouchableOpacity>
          <Text style={styles.reactionNum}>4.2 K</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postCard: {
    width: wp(100),
    flexDirection: "row",
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
  postFooter: {
    height: hp(6),
    width: wp(75),
    alignItems: "center",
    flexDirection: "row",
    gap: hp(1),
  },
  reactionNum: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(1.2),
    color: "grey",
  },
});
