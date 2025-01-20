import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import Dialog from "react-native-dialog";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "expo-router";
export default function Profile() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const { user } = useAuth();
  const number = user.mobile_number || "Not Set Yet";
  const fullName = user.full_name || "Not Set Yet";
  const userName = user.username || "Not Set Yet";
  const location = user.location || "Not Set Yet";
  const email = user.email || "Not Set Yet";
  // Reusable Menu Item Component
  const MenuItem = ({ icon, text, screen }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          router.push(screen);
        }}
        style={styles.menuItem}
      >
        <Ionicons name={icon} size={24} color="#555" />
        <Text style={styles.menuText}>{text}</Text>
      </TouchableOpacity>
    );
  };
  const [visible, setVisible] = useState(false); // State to control dialog visibility

  const router = useRouter();
  const { signOut } = useAuth();

  const handleCancel = () => {
    setVisible(false);
  };

  const handleLogout = async () => {
    // Logout Logic
    await signOut();
    setVisible(false);
  };

  const logout = async () => {
    setVisible(true);
  };
  return (
    <View>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/screens/EditProfile");
          }}
        >
          <AntDesign name="edit" size={hp(3)} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileCont}>
        <Image
          source={{
            uri: user.profile_url,
          }}
          style={styles.profilePic}
        />
        <View>
          <Text style={styles.fName}>{fullName}</Text>
          <Text style={styles.Uname}>{userName}</Text>
        </View>
      </View>
      <View style={styles.infoCont}>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#777" />
          <Text style={styles.infoText}>{number}</Text>
        </View>

        {/* Email */}
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#777" />
          <Text style={styles.infoText}>{email}</Text>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#777" />
          <Text style={styles.infoText}>{location}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <MenuItem
          icon="book-outline"
          screen="screens/ExchangeBooks"
          text="My Books"
        />
        <MenuItem
          icon="receipt-outline"
          screen="screens/ExchangeBooks"
          text="Purchase History"
        />
        <MenuItem
          icon="location-outline"
          screen="screens/ExchangeBooks"
          text="Track Order"
        />
        <MenuItem
          icon="swap-horizontal-outline"
          screen="screens/ExchangeBooks"
          text="Exchange Books"
        />
        <MenuItem
          icon="bookmarks-outline"
          screen="screens/ExchangeBooks"
          text="Borrow Books"
        />
        {/* Logout */}
        {/* Dialog */}
        <Dialog.Container visible={visible}>
          <Dialog.Title>Logout Alert</Dialog.Title>
          <Dialog.Description>
            Do you want to logout from this account ?
          </Dialog.Description>
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Logout" onPress={handleLogout} />
        </Dialog.Container>
        <TouchableOpacity onPress={logout} style={styles.logout}>
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: hp(8),
    width: wp(100),
    padding: wp(4),

    flexDirection: "row-reverse",
  },
  profileCont: {
    justifyContent: "center",
    alignItems: "center",
    width: wp(100),

    flexDirection: "row",
    paddingLeft: wp(20),
    gap: wp(6),
    paddingRight: wp(20),
  },
  profilePic: {
    height: hp(12),
    aspectRatio: 1,
    borderRadius: 100,
  },

  fName: {
    fontSize: hp(2.5),
    fontFamily: "OpenSans_400Regular",
    fontWeight: "bold",
    color: "rgba(60, 105, 96, 1)",
  },
  Uname: {
    fontSize: hp(2),
    fontFamily: "OpenSans_400Regular",
    color: "rgba(60, 105, 96, 1)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  infoCont: {
    paddingLeft: wp(15),
    marginVertical: hp(3),
  },
  infoText: {
    marginLeft: wp(3),
    fontSize: 14,
    color: "#777",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: {
    fontSize: hp(2),
    marginLeft: wp(3),
    fontFamily: "OpenSans_400Regular",
    color: "#333",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
  },
  logoutText: {
    fontSize: hp(2),
    marginLeft: wp(3),
    fontFamily: "OpenSans_400Regular",
    color: "red",
    fontWeight: "bold",
  },
  menu: {
    paddingHorizontal: wp(10),
  },
});
