import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
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
import PostCard from "@/components/PostCard";
import { showMessage, hideMessage } from "react-native-flash-message";
import { fetchFollowingPosts, fetchAllPosts, createPost } from "@/utils/posts";
import { useAuth } from "@/hooks/AuthContext";
import { BottomSheet } from "react-native-sheet";
import { formatDateTime } from "@/utils/time";
import Loading from "@/components/Loading";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextInput } from "react-native-paper";
export default function Community() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const [allPosts, setAllPosts] = useState();
  const { user } = useAuth();
  const [FollowingPosts, setFollowingPosts] = useState();
  const [loading, setLoading] = useState(true);
  const bottomSheet = useRef<BottomSheetRef>(null);
  const postRef = useRef("");
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const all = await fetchAllPosts();
        setAllPosts(all);
        const following = await fetchFollowingPosts(user?.id);
        setFollowingPosts(following);
        console.log(all);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    })();
  }, []);
  const [activeTab, setActiveTab] = useState("New"); // State to manage active tab

  const submitPost = async () => {
    console.log(postRef.current);
    const response = await createPost(user?.id, postRef.current);

    if (response) {
      showMessage({
        message: "Shelf to tales",
        description: "Post Uploaded",
        type: "success",
      });
    } else {
      showMessage({
        message: "Shelf to tales",
        description: "Something went wrong",
        type: "danger",
      });
    }
    bottomSheet.current?.hide();
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <View style={styles.container}>
      <BottomSheet height={350} ref={bottomSheet}>
        <TextInput
          placeholder="Write down your experience, thoughts"
          style={{
            height: hp(30),
            fontSize: hp(2),
            backgroundColor: "white",
          }}
          onChangeText={(e) => (postRef.current = e)}
        />
        <TouchableOpacity
          style={{
            height: hp(5),
            width: wp(25),
            backgroundColor: "#3c6960",
            borderRadius: hp(2),
            justifyContent: "center",
            marginTop: hp(5),
            marginLeft: wp(70),
          }}
          onPress={submitPost}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: hp(2),
              fontFamily: "OpenSans_400Regular",
              color: "white",
            }}
          >
            Post
          </Text>
        </TouchableOpacity>
      </BottomSheet>
      <View style={styles.tab}>
        <TouchableOpacity
          style={styles.tabOpt}
          onPress={() => handleTabPress("New")}
        >
          <Text
            style={{
              fontFamily:
                activeTab === "New"
                  ? "OpenSans_700Bold"
                  : "OpenSans_400Regular",
              fontSize: hp(2),
            }}
          >
            New
          </Text>
          <View
            style={{
              height: hp(0.8),
              width: wp(10),
              backgroundColor: activeTab === "New" ? "#3c6960" : "transparent",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabOpt}
          onPress={() => handleTabPress("Following")}
        >
          <Text
            style={{
              fontFamily:
                activeTab === "Following"
                  ? "OpenSans_700Bold"
                  : "OpenSans_400Regular",
              fontSize: hp(2),
            }}
          >
            Following
          </Text>
          <View
            style={{
              height: hp(0.8),
              width: wp(10),
              backgroundColor:
                activeTab === "Following" ? "#3c6960" : "transparent",
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: wp(0.5),
          width: wp(100),
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      />
      <ScrollView style={{ height: hp(80) }}>
        {activeTab === "Following" &&
          (FollowingPosts?.length > 0 ? (
            FollowingPosts.map((post) => (
              <PostCard
                key={post.id}
                profileUrl={post.profile_url}
                content={post.content}
                username={post.username}
                time={formatDateTime(post.created_at)}
                userId={post.userId}
              />
            ))
          ) : (
            <Text
              style={{
                fontSize: hp(1.5),
                fontFamily: "OpenSans_400Regular",
                marginLeft: wp(25),
                marginTop: hp(2),
              }}
            >
              You don't follow anyone yet.
            </Text>
          ))}

        {activeTab === "New" &&
          (allPosts?.length > 0 ? (
            allPosts.map((post) =>
              post.users.id != user?.id ? (
                <PostCard
                  key={post.id}
                  profileUrl={post.users.profile_url}
                  content={post.content}
                  username={post.users.username}
                  time={formatDateTime(post.created_at)}
                  userId={post.users.id}
                />
              ) : null
            )
          ) : (
            <Text
              style={{
                fontSize: hp(1.5),
                fontFamily: "OpenSans_400Regular",
                marginLeft: wp(25),
                marginTop: hp(2),
              }}
            >
              No new posts available.
            </Text>
          ))}

        <View style={{ height: hp(10) }}></View>
      </ScrollView>

      <TouchableOpacity
        style={{
          position: "absolute",
          height: hp(6),
          top: hp(69),
          left: wp(83),
          aspectRatio: 1,
          borderRadius: 100,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#3c6960",
        }}
        onPress={() => {
          bottomSheet.current?.show();
        }}
      >
        <Ionicons name="create-outline" size={hp(3)} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(100),
    width: wp(100),
  },
  tab: {
    width: wp(100),
    height: hp(7),
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  tabOpt: {
    alignItems: "center",
    gap: 5,
  },
});
