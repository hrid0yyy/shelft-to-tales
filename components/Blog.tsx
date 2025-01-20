import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
export default function Blog() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const text = `Step into a haven for book lovers, where pages whisper adventures, characters come alive, and imaginations soar. Whether you're seeking
  timeless classics, contemporary gems, or hidden treasures, our shelves
  are brimming with tales that inspire, captivate, and transport you to
  new horizons. At Shelf to Tales, we believe every reader has a story,
  and every story deserves a reader. Let's help you find your next
  unforgettable journey. Come, explore, and let your story begin here.`;

  // Remove all newlines
  const singleLineText = text.replace(/\n/g, " ");
  function limitText(text, maxLength = 80) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  }
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const boxCount = 2; // Number of boxes to scroll through

  useEffect(() => {
    const interval = setInterval(() => {
      scrollToNextBox();
    }, 10000); // 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentIndex]);
  const screenWidth = Dimensions.get("window").width;
  const scrollToNextBox = () => {
    const nextIndex = (currentIndex + 1) % boxCount; // Loop back to the first box
    scrollViewRef.current?.scrollTo({
      x: nextIndex * screenWidth, // Scroll horizontally based on the screen width
      animated: true,
    });
    setCurrentIndex(nextIndex);
  };
  return (
    <ScrollView
      // this is for auto rotate
      //   ref={scrollViewRef}
      horizontal
      pagingEnabled
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.box}>
        <Text style={styles.boxHeadline}>Welcome to Shelf to tales</Text>
        <View style={{}}>
          <Text style={{ fontSize: hp(1), marginLeft: hp(1) }}>Powered By</Text>
          <Image
            style={styles.image}
            source={require("@/assets/images/logo.png")}
          />
        </View>
        <Text style={styles.boxDescription}>{limitText(singleLineText)}</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxHeadline}>Welcome to Shelf to tales</Text>
        <View style={{}}>
          <Text style={{ fontSize: hp(1), marginLeft: hp(1) }}>Powered By</Text>
          <Image
            style={styles.image}
            source={require("@/assets/images/logo.png")}
          />
        </View>
        <Text style={styles.boxDescription}>{limitText(singleLineText)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    marginLeft: wp(5),
    marginBottom: hp(2),
    flexDirection: "row",
  },
  box: {},
  boxHeadline: {
    fontSize: hp(4.5),
    width: wp(90),
    fontFamily: "OpenSans_400Regular",
    color: "#3c6960",
  },
  boxDescription: {
    fontSize: hp(1.5),
    width: wp(90),
    color: "grey",
    fontFamily: "OpenSans_400Regular",
  },
});
