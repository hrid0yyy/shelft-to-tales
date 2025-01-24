import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
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
import { updateProfile } from "@/utils/profile";
import { uploadImageToServer } from "@/utils/image";
import { showMessage, hideMessage } from "react-native-flash-message";
import Loading from "@/components/Loading";
export default function EditProfile() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const router = useRouter();
  const [image, setImage] = useState(null);
  const { user, up, setUp } = useAuth();
  const username = useRef(user?.username);
  const location = useRef(user?.location);
  const mobileNumber = useRef(user?.mobile_number);
  const fullName = useRef(user?.full_name);
  const bio = useRef(user?.bio);
  const profileUrl = useRef(user?.profile_url);
  const [loading, setLoading] = useState(false);

  const updateUser = async () => {
    setLoading(true);
    if (image) {
      const img = await uploadImageToServer(image);
      profileUrl.current = img;
      console.log(img);
    }
    const updateFields = {
      username: username.current.trim(),
      location: location.current.trim(),
      mobile_number: mobileNumber.current.trim(),
      full_name: fullName.current.trim(),
      bio: bio.current.trim(),
      profile_url: profileUrl.current,
    };

    const response = await updateProfile(user?.id, updateFields);
    setUp(!up);
    setLoading(false);
    if (response.success) {
      showMessage({
        message: "Shelf to tales",
        description: "Profile Edited Successfully",
        type: "success",
      });
    } else {
      showMessage({
        message: "Shelf to tales",
        description: "Something went wrong",
        type: "danger",
      });
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <ScrollView>
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
        {image ? (
          <Image
            style={styles.pic}
            source={{
              uri: image,
            }}
          />
        ) : (
          <Image
            style={styles.pic}
            source={{
              uri: user.profile_url,
            }}
          />
        )}

        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.changePicText}>Change profile picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inp}>
        <View>
          <Text style={styles.txt}>User name</Text>
          <TextInput
            placeholder={user?.username}
            style={styles.inpBox}
            onChangeText={(e) => (username.current = e)}
          />
        </View>
        <View>
          <Text style={styles.txt}>Full Name</Text>
          <TextInput
            placeholder={user?.full_name}
            style={styles.inpBox}
            onChangeText={(e) => (fullName.current = e)}
          />
        </View>
        <View>
          <Text style={styles.txt}>Location</Text>
          <TextInput
            placeholder={user?.location}
            style={styles.inpBox}
            onChangeText={(e) => (location.current = e)}
          />
        </View>
        <View>
          <Text style={styles.txt}>Mobile Number</Text>
          <TextInput
            placeholder={user?.mobile_number}
            style={styles.inpBox}
            onChangeText={(e) => (mobileNumber.current = e)}
          />
        </View>
        <View>
          <Text style={styles.txt}>Bio</Text>
          <TextInput
            placeholder={user?.bio}
            style={styles.inpBox}
            onChangeText={(e) => (bio.current = e)}
          />
        </View>
      </View>
      <View style={{ height: hp(12) }}></View>
      <TouchableOpacity onPress={updateUser} style={styles.saveBtn}>
        <Text style={styles.saveTxt}>Save</Text>
      </TouchableOpacity>
      <View style={{ height: hp(3) }}></View>
    </ScrollView>
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
