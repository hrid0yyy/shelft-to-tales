import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { getUserProfile, toggleFollow } from "@/utils/profile";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import AntDesign from "@expo/vector-icons/AntDesign";
import Dialog from "react-native-dialog";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // Import the message icon
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfileBookCard from "@/components/ProfileBookCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";
import { formatDateTime } from "@/utils/time";
import Loading from "@/components/Loading";
import PostCard from "@/components/PostCard";

export default function UserProfile() {
  const [selectedOption, setSelectedOption] = useState(
    "Available for exchange"
  );
  const handleSelect = (option) => {
    setSelectedOption(option);
  };
  const [isFollowing, setIsFollowing] = useState(false); // State to toggle follow/unfollow
  const [visible, setVisible] = useState(false); // State to control dialog visibility
  const [activeTab, setActiveTab] = useState("Posts"); // Default active tab for Posts and Books
  const { user } = useAuth();
  const { userId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const router = useRouter();
  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = async () => {
    // Unfollow logic
    setIsFollowing(!isFollowing);
    await toggleFollow(user?.id, userId, user?.username);
    setVisible(false);
  };

  useEffect(() => {
    (async () => {
      const response = await getUserProfile(user?.id, userId);
      setDetails(response);
      console.log(response);
      if (response.iFollow) {
        setIsFollowing(true);
      }
      setLoading(false);
    })();
  }, []);

  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.back}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="arrowleft" size={hp(4)} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.profile}>
          <Image
            style={styles.profilePic}
            source={{
              uri: details.profile_url,
            }}
          />
          <Text style={styles.userName}>{details.full_name}</Text>
          <Text style={styles.userHandle}>@{details.username}</Text>
          <TouchableOpacity
            style={[
              styles.followBtn,
              isFollowing && styles.unfollowBtn, // Apply unfollow style when following
            ]}
            onPress={() => {
              if (isFollowing) {
                showDialog(); // Show dialog on Unfollow
              } else {
                setIsFollowing(true); // Follow directly
                (async () => {
                  await toggleFollow(user?.id, userId, user?.username);
                })();
              }
            }}
          >
            <Text
              style={[
                styles.followBtnText,
                isFollowing && styles.unfollowBtnText, // Change text color when following
              ]}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.userBio}>{details.bio}</Text>
          <View style={styles.metaInfo}>
            {/* <Text style={styles.metaText}>Entertainment & Recreation</Text> */}
            <Text style={styles.metaText}>• {details.location}</Text>
            <Text style={styles.metaText}>
              • Joined {formatDateTime(details.createdAt)} •
            </Text>
          </View>
          <View style={styles.followInfo}>
            <Text style={styles.followText}>
              <Text style={styles.boldText}>{details.following}</Text> Following
            </Text>
            <Text style={styles.followText}>
              <Text style={styles.boldText}>{details.follower}</Text> Followers
            </Text>
          </View>
        </View>

        {/* Posts and Books Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("Posts")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Posts" && styles.activeTabText,
              ]}
            >
              Posts
            </Text>
            {activeTab === "Posts" && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("Books")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Books" && styles.activeTabText,
              ]}
            >
              Books
            </Text>
            {activeTab === "Books" && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Conditional Rendering */}
        {activeTab === "Posts" && (
          <>
            {details.posts.map((post) => (
              <PostCard
                key={post.id}
                profileUrl={details.profile_url}
                content={post.content}
                username={details.username}
                time={formatDateTime(post.created_at)}
                userId={userId}
              />
            ))}
          </>
        )}
        {activeTab === "Books" && (
          <>
            <View style={styles.box}>
              <View style={styles.books}>
                <Text style={styles.type}>{selectedOption}</Text>
                <ScrollView style={{ height: hp(70) }}>
                  {selectedOption == "E Books" &&
                    details.eb_access.map((book) => (
                      <ProfileBookCard
                        key={book.bookId}
                        cover={book.books.cover}
                        title={book.books.title}
                        author={book.books.author}
                      />
                    ))}
                  {selectedOption == "Wishlist" &&
                    details.wishlist.map((book) => (
                      <TouchableOpacity
                        onPress={() => {
                          router.replace(
                            `/screens/BookDetails?bookId=${book.bookId}`
                          );
                        }}
                      >
                        <ProfileBookCard
                          key={book.bookId}
                          cover={book.books.cover}
                          title={book.books.title}
                          author={book.books.author}
                        />
                      </TouchableOpacity>
                    ))}
                  {selectedOption == "Available for exchange" &&
                    details.exchange_books
                      .filter((book) => book.available === 1) // Filter books with available == 1
                      .map((book) => (
                        <TouchableOpacity
                          onPress={() => {
                            router.replace(
                              `/screens/ExchangeBooksDetails?exchangeId=${book.exchangeId}`
                            );
                          }}
                        >
                          <ProfileBookCard
                            key={book.exchangeId}
                            cover={book.image}
                            title={book.title}
                            author={book.description}
                          />
                        </TouchableOpacity>
                      ))}
                </ScrollView>
              </View>
              <View>
                <Menu>
                  <MenuTrigger>
                    <Ionicons name="filter" size={hp(3)} color="black" />
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption
                      onSelect={() => handleSelect("Available for exchange")}
                      text="Available for exchange"
                      customStyles={{ optionText: styles.menuText }}
                    />
                    <MenuOption
                      onSelect={() => handleSelect("E Books")}
                      text="E Books"
                      customStyles={{ optionText: styles.menuText }}
                    />

                    <MenuOption
                      onSelect={() => handleSelect("Wishlist")}
                      text="Wishlist"
                      customStyles={{ optionText: styles.menuText }}
                    />
                  </MenuOptions>
                </Menu>
              </View>
            </View>
          </>
        )}

        {/* Dialog */}
        <Dialog.Container visible={visible}>
          <Dialog.Title>Account Unfollow</Dialog.Title>
          <Dialog.Description>
            Do you want to unfollow this account? You can always follow them
            back later.
          </Dialog.Description>
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Unfollow" onPress={handleDelete} />
        </Dialog.Container>
      </ScrollView>
      {/* Floating Message Icon */}
      <TouchableOpacity
        onPress={() => {
          router.push(`/screens/ChatBox?receiverId=${details.id}`);
        }}
        style={styles.floatingButton}
      >
        <MaterialIcons name="message" size={hp(3)} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
  },
  books: {
    width: wp(90),
    paddingHorizontal: hp(3),
  },
  type: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(1.8),
  },
  floatingButton: {
    position: "absolute",
    bottom: hp(4),
    right: wp(4),
    backgroundColor: "#3c6960",
    width: hp(7),
    height: hp(7),
    borderRadius: hp(3.5),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  back: {
    paddingHorizontal: hp(2),
    paddingTop: hp(2),
    backgroundColor: "rgba(60, 105, 96, 1)",
  },
  profile: {
    alignItems: "center",
    paddingBottom: hp(3),
    backgroundColor: "rgba(60, 105, 96, 1)",
    borderBottomLeftRadius: hp(5),
    borderBottomRightRadius: hp(5),
  },
  profilePic: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: 2,
    borderColor: "white",
    marginBottom: hp(1.5),
  },
  userName: {
    fontFamily: "OpenSans_700Bold",
    fontSize: hp(2.5),
    color: "white",
  },
  userHandle: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(1.8),
    color: "rgba(200, 200, 200, 1)",
    marginBottom: hp(1),
  },
  userBio: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(1.5),
    color: "white",
    textAlign: "center",
    marginHorizontal: wp(5),
    marginBottom: hp(2),
  },
  metaInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: hp(1),
  },
  metaText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(1.4),
    color: "rgba(200, 200, 200, 1)",
    marginHorizontal: wp(1),
  },
  followInfo: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(5),
  },
  followText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(1.6),
    color: "white",
  },
  boldText: {
    fontFamily: "OpenSans_700Bold",
    fontSize: hp(1.8),
  },
  followBtn: {
    height: hp(5),
    paddingHorizontal: hp(2),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1),
    borderRadius: hp(2),
  },
  menuText: {
    fontSize: 16,
    color: "black",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  followBtnText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(2),
    color: "rgba(60, 105, 96, 1)",
  },
  unfollowBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
  },
  unfollowBtnText: {
    color: "white",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: hp(2),
    color: "grey",
  },
  activeTabText: {
    fontFamily: "OpenSans_700Bold",
    color: "#3c6960",
  },
  activeIndicator: {
    height: wp(1),
    width: wp(6),
    backgroundColor: "#3c6960",
    marginTop: hp(0.5),
  },
});
