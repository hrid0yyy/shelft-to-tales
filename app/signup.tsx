import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { MaterialIcons } from "@expo/vector-icons"; // For eye icon
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";
import Loading from "@/components/Loading";

const Signup = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Password visibility state
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false); // Confirm Password visibility state

  const emailRef = useRef("");
  const passRef = useRef("");
  const usernameRef = useRef("");
  const confirmpassRef = useRef("");
  const { signup } = useAuth();
  const [loading, setloading] = useState(false);
  const signUpAction = async () => {
    if (
      !emailRef.current ||
      !passRef.current ||
      !usernameRef.current ||
      !confirmpassRef.current
    ) {
      Alert.alert("Sign Up", "Please fill all the fields!");
      return;
    }
    if (passRef.current != confirmpassRef.current) {
      Alert.alert("Sign Up", "password doesnt match");
      return;
    }
    await signup(emailRef.current, passRef.current, usernameRef.current);
  };

  if (loading) {
    return <Loading />;
  }

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={[styles.title, { fontFamily: "OpenSans_700Bold" }]}>
        Create Account
      </Text>
      <Text style={[styles.subtitle, { fontFamily: "OpenSans_400Regular" }]}>
        Sign up to join Shelf to Tales
      </Text>

      {/* Input Fields */}
      <TextInput
        style={[styles.input, { fontFamily: "OpenSans_400Regular" }]}
        placeholder="Username"
        placeholderTextColor="#A8A8A8"
        onChangeText={(value) => (usernameRef.current = value.trim())}
      />
      <TextInput
        style={[styles.input, { fontFamily: "OpenSans_400Regular" }]}
        placeholder="Email"
        placeholderTextColor="#A8A8A8"
        keyboardType="email-address"
        onChangeText={(value) => (emailRef.current = value.trim())}
      />

      {/* Password Field */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, { fontFamily: "OpenSans_400Regular" }]}
          placeholder="Password"
          placeholderTextColor="#A8A8A8"
          secureTextEntry={!isPasswordVisible}
          onChangeText={(value) => (passRef.current = value.trim())}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={isPasswordVisible ? "visibility" : "visibility-off"}
            size={wp("6%")} // Slightly larger eye icon
            color="#A8A8A8"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Field */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, { fontFamily: "OpenSans_400Regular" }]}
          placeholder="Confirm Password"
          placeholderTextColor="#A8A8A8"
          secureTextEntry={!isConfirmPasswordVisible}
          onChangeText={(value) => (confirmpassRef.current = value.trim())}
        />
        <TouchableOpacity
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={isConfirmPasswordVisible ? "visibility" : "visibility-off"}
            size={wp("6%")}
            color="#A8A8A8"
          />
        </TouchableOpacity>
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          signUpAction();
        }}
      >
        <Text style={[styles.buttonText, { fontFamily: "OpenSans_700Bold" }]}>
          Sign Up
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <Pressable
        onPress={() => {
          router.push("/login");
        }}
      >
        <Text style={[styles.linkText, { fontFamily: "OpenSans_400Regular" }]}>
          Already have an account?{" "}
          <Text style={[styles.link, { fontFamily: "OpenSans_700Bold" }]}>
            Log in
          </Text>
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("3%"),
  },
  title: {
    fontSize: wp("7%"),
    color: "#3c6960",
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  subtitle: {
    fontSize: wp("4%"),
    color: "#6B6B6B",
    marginBottom: hp("3%"),
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F6F6F6",
    padding: hp("1.5%"),
    borderRadius: wp("3%"),
    fontSize: wp("4%"),
    color: "#000",
    marginBottom: hp("2%"),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: wp("3%"),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: hp("2%"),
    paddingHorizontal: wp("3%"),
  },
  passwordInput: {
    flex: 1,
    fontSize: wp("4%"),
    color: "#000",
    paddingVertical: hp("1.5%"),
  },
  eyeIcon: {
    marginLeft: wp("2%"),
  },
  button: {
    backgroundColor: "#3c6960",
    paddingVertical: hp("2%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    marginTop: hp("2%"),
  },
  buttonText: {
    fontSize: wp("4%"),
    color: "#FFFFFF",
  },
  linkText: {
    fontSize: wp("4%"),
    color: "#6B6B6B",
    marginTop: hp("2%"),
    textAlign: "center",
  },
  link: {
    color: "#3c6960",
    textDecorationLine: "underline",
  },
});

export default Signup;
