import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
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
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useRouter } from "expo-router";
import Book from "@/components/Book";
export default function Books() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  const [activeTab, setActiveTab] = useState("Purchase"); // Track the active tab
  const [activeGenre, setActiveGenre] = useState("All"); // Track the active genre
  const [sort, setSort] = useState("");
  const router = useRouter();
  // Array for tabs

  const tabs = ["Purchase", "Borrow", "Exchange"];

  // Genre array
  const genres = [
    "All",
    "Science-Fiction",
    "Novel",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Non-Fiction",
    "Biography",
    "Romance",
    "Adventure",
  ];

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  const handleGenrePress = (genreName) => {
    setActiveGenre(genreName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headBar}>
        {tabs.map((tab) => (
          <View key={tab} style={styles.box}>
            <TouchableOpacity onPress={() => handleTabPress(tab)}>
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily:
                    activeTab === tab
                      ? "OpenSans_700Bold"
                      : "OpenSans_400Regular",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height: hp(0.5),
                width: wp(10),
                backgroundColor:
                  activeTab === tab ? "rgba(60, 105, 96, 1)" : "transparent",
              }}
            ></View>
          </View>
        ))}
      </View>
      <View style={styles.innerContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sideBar}>
            {genres.map((genre) => (
              <View
                key={genre}
                style={{
                  height: hp(7),
                  width: wp(30),
                  alignItems: "center",
                  gap: hp(1.5),
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    height: hp(3),
                    width: wp(3),
                    backgroundColor:
                      activeGenre === genre
                        ? "rgba(60, 105, 96, 1)"
                        : "transparent",
                  }}
                ></View>
                <TouchableOpacity onPress={() => handleGenrePress(genre)}>
                  <Text
                    style={{
                      fontSize: hp(1.5),
                      fontFamily:
                        activeGenre === genre
                          ? "OpenSans_700Bold"
                          : "OpenSans_400Regular",
                      color:
                        activeGenre === genre
                          ? "rgba(60, 105, 96, 1)"
                          : "black",
                    }}
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* books section */}
        <View style={styles.section}>
          <View
            style={{
              height: hp(6),
              width: wp(65),
              flexDirection: "row-reverse",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Menu>
              <MenuTrigger>
                <Feather name="filter" size={hp(3)} color="black" />
              </MenuTrigger>
              <MenuOptions>
                {/* Low to High */}
                <MenuOption onSelect={() => setSort("asc")}>
                  <Text style={styles.menuOptionText}>Low to High</Text>
                </MenuOption>

                {/* High to Low */}
                <MenuOption onSelect={() => setSort("desc")}>
                  <Text style={styles.menuOptionText}>High to Low</Text>
                </MenuOption>

                {/* Set Price Range */}
                <MenuOption onSelect={() => {}}>
                  <Text style={styles.menuOptionText}>Near Me</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingBottom: hp(15) }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.books}>
              <Book type={activeTab} sort={sort} genre={activeGenre} />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headBar: {
    height: hp(8),
    width: wp(100),
    marginLeft: hp(3),
    flexDirection: "row",
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    height: hp(8),
    width: wp(30),
    gap: hp(1),
  },
  innerContainer: {
    height: hp(80),
    width: wp(100),
    flexDirection: "row",
  },
  sideBar: {
    width: wp(35),
  },
  section: {
    width: wp(65),
  },
  scrollContent: {
    paddingBottom: hp(2),
  },
  books: {
    gap: hp(2),
    padding: 5,
  },
  book: {
    height: hp(15),
    width: wp(55),
    flexDirection: "row",
  },
  menuOptionText: {
    fontSize: hp(2),
    padding: hp(1),
    color: "black",
  },
});
