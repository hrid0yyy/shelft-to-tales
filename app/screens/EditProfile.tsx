import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useRef } from "react";
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
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";
export default function EditProfile() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const router = useRouter();
  const { user } = useAuth();
  const username = useRef();
  const location = useRef();
  const mobileNumber = useRef();
  const fullName = useRef();
  return (
    <View>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/screens/App");
          }}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.editText}>Edit Profile </Text>
      <View style={styles.editContainer}>
        <Image
          style={styles.pic}
          source={{
            uri: user.profile_url,
          }}
        />
        <TouchableOpacity>
          <Text style={styles.changePicText}>Change profile picture</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inp}>
        <View>
          <Text style={styles.txt}>Username</Text>
          <TextInput
            placeholder="Enter Username"
            value={user.username}
            style={styles.inpBox}
          />
        </View>
        <View>
          <Text style={styles.txt}>Full Name</Text>
          <TextInput
            placeholder="Enter Full Name"
            value={user.full_name}
            style={styles.inpBox}
          />
        </View>
        <View>
          <Text style={styles.txt}>Location</Text>
          <TextInput
            placeholder="Enter Location"
            value={user.location}
            style={styles.inpBox}
          />
        </View>
        <View>
          <Text style={styles.txt}>Mobile Number</Text>
          <TextInput
            placeholder="Enter Mobile Number"
            value={user.mobile_number}
            style={styles.inpBox}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveTxt}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  topBar: {
    height: hp(8),
    width: wp(100),
    padding: wp(4),
    flexDirection: "row",
  },
  editContainer: {
    height: hp(22),
    width: wp(100),

    alignItems: "center",
    gap: hp(1),
  },
  editText: {
    marginLeft: wp(5),
    fontSize: hp(3),
    fontFamily: "OpenSans_400Regular",
    marginBottom: hp(2),
  },
  pic: {
    height: hp(15),
    aspectRatio: 1,
    borderRadius: 100,
  },
  changePicText: {
    color: "grey",
    fontSize: hp(2),
    fontFamily: "OpenSans_400Regular",
  },
  inp: {
    height: hp(50),
    width: wp(100),

    paddingHorizontal: wp(5),
    gap: hp(2),
  },
  txt: {
    fontSize: hp(2),
    color: "grey",
  },
  inpBox: {
    height: hp(7),
    width: wp(90),
    borderBottomWidth: 2,
    borderBottomColor: "rgba(1,1,1,0.2)",
  },
  saveBtn: {
    height: hp(6),
    width: wp(20),
    justifyContent: "center",
    marginLeft: wp(75),
    backgroundColor: "rgba(60, 105, 96, 1)",
    borderRadius: hp(1),
    marginTop: hp(2),
  },
  saveTxt: {
    textAlign: "center",
    color: "white",
    fontFamily: "OpenSans_400Regular",
  },
});
